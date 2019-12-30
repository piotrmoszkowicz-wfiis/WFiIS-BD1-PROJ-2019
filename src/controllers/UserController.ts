import _ from "lodash";
import {
  Body,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put
} from "routing-controllers";

import User from "@models/User";
import UserService from "@services/UserService";

import { LoginRequest } from "LoginRequest";

@JsonController()
export default class UserController {
  constructor(private userService = new UserService()) {}

  @Get("/user/list")
  @OnUndefined(400)
  public getUsers() {
    return this.userService.getUsers().then(users => {
      if (!users) {
        return undefined;
      }
      return users.map(user => _.omit(user.toJSON(), ["token", "password"]));
    });
  }

  @Get("/user/single/:userId")
  @OnUndefined(400)
  public async getUser(@Param("userId") userId: number) {
    return this.userService.getUserById(userId).then(user => {
      if (!user) {
        return undefined;
      }
      return _.omit(user.toJSON(), ["token", "password"]);
    });
  }

  @Put("/user/:userId")
  @OnUndefined(400)
  public updateUser(
    @Param("userId") userId: number,
    @Body({ required: true }) newUserData: Partial<User>
  ) {
    return this.userService.updateUser(
      userId,
      _.omit(newUserData, [
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "token"
      ])
    );
  }

  @Post("/user/login")
  @OnUndefined(401)
  public login(@Body({ required: true }) loginRequest: LoginRequest) {
    return this.userService.loginUser(
      loginRequest.email,
      loginRequest.password
    );
  }
}
