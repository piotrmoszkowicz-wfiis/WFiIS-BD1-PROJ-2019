import { Body, JsonController, OnUndefined, Post } from "routing-controllers";

import { LoginRequest } from "LoginRequest";
import UserService from "@services/UserService";

@JsonController()
export default class UserController {
  constructor(private userService = new UserService()) {}

  @Post("/user/login")
  @OnUndefined(401)
  public login(@Body({ required: true }) loginRequest: LoginRequest) {
    return this.userService.loginUser(
      loginRequest.email,
      loginRequest.password
    );
  }
}
