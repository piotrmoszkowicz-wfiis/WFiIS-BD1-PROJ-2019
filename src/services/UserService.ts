import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken";

import Soldier from "@models/Soldier";
import User from "@models/User";

import logger from "@utils/logger";

export default class UserService {
  constructor(
    readonly jwtKey = config.get<string>("app.jwtKey"),
    readonly soldierModel = Soldier,
    readonly userModel = User
  ) {}

  public getUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  public getUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id, {
      include: [
        {
          model: this.soldierModel
        }
      ]
    });
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

  public async updateUser(id: number, userData: Partial<User>) {
    try {
      if (userData.password) {
        userData.password = await UserService.hashPassword(userData.password);
      }

      const result = await this.userModel.update<User>(userData, {
        where: {
          id
        }
      });

      if (!result[0]) {
        return undefined;
      }

      return {
        updated: true
      };
    } catch (err) {
      logger.log("error", "Error while updating user", { userData });
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

  private async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        email
      }
    });
  }
}
