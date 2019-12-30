import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken";

import User from "@models/User";
import logger from "@utils/logger";

export default class UserService {
  constructor(
    readonly jwtKey = config.get<string>("app.jwtKey"),
    readonly userModel = User
  ) {}

  public async getUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  public async loginUser(email: string, password: string) {
    try {
      const user = await this.getUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("There's no such user, or user gave wrong password!");
      }

      return {
        token: await this.generateJWT(user)
      };
    } catch (err) {
      logger.log("error", "Error while logging in", { err, email });
      return undefined;
    }
  }

  public static hashPassword(password): Promise<string> {
    return bcrypt.hash(password, config.get<number>("app.saltRounds"));
  }

  private async generateJWT(user: User) {
    const { password, ...userData } = user.toJSON() as User;
    const token = jwt.sign(userData, this.jwtKey);
    user.token = token;
    await user.save();
    return token;
  }

  private async getUserByEmail(
    email: string,
  ): Promise<User> {
    return this.userModel.findOne({
      where: {
        email
      }
    });
  }
}
