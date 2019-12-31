import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken";

import Soldier from "@models/Soldier";
import User from "@models/User";

import logger from "@utils/logger";

/**
 * Class representing UserService, which does all operations connected with User
 */
export default class UserService {
  constructor(
    readonly jwtKey = config.get<string>("app.jwtKey"),
    readonly soldierModel = Soldier,
    readonly userModel = User
  ) {}

  /**
   * Get all users list
   */
  public getUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  /**
   * Gets single user by his/her ID
   * @param id                      - ID of user
   */
  public getUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id, {
      include: [
        {
          model: this.soldierModel
        }
      ]
    });
  }

  /**
   * Logs in user by email and password
   * @param email                     - Email of user
   * @param password                  - Password of user
   */
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

  /**
   * Update single user
   * @param id                          - ID of user to update
   * @param userData                    - Data to update with
   */
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
      logger.log("error", "Error while updating user", { userData, id, err });
      return undefined;
    }
  }

  /**
   * Hashes password with Bcrypt
   * @param password                      - Password to hash
   */
  public static hashPassword(password): Promise<string> {
    return bcrypt.hash(password, config.get<number>("app.saltRounds"));
  }

  /**
   * Generates JWT Token base on user data
   * @private
   * @param user                          - User to generate token for
   */
  private async generateJWT(user: User) {
    const { password, ...userData } = user.toJSON() as User;
    const token = jwt.sign(userData, this.jwtKey);
    user.token = token;
    await user.save();
    return token;
  }

  /**
   * Gets user by email
   * @private
   * @param email                         - User's email
   */
  private async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        email
      }
    });
  }
}
