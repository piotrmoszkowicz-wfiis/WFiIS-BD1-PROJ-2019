import config from "config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

import UserService from "@services/UserService";
import logger from "@utils/logger";

import { RequestOverride } from "RequestOverride";
import UserRights from "UserRights";

@Middleware({ type: "before" })
export default class AuthMiddleware implements ExpressMiddlewareInterface {
  async use(
    request: RequestOverride,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    if (request.url.includes("login") || request.url.includes("status")) {
      return next();
    }

    try {
      const token = request.header("Authorization").replace("Bearer ", "");
      const data = jwt.verify(token, config.get("app.jwtKey"));

      const userService = new UserService();
      const user = await userService.getUserById(data.id);

      if (!user || user.rights !== UserRights.Administrator) {
        throw new Error();
      }
      request.user = user;
      request.token = token;
      return next();
    } catch (err) {
      logger.log("error", "AuthMiddlewareError", { err });
      response
        .status(401)
        .send({ error: "Not authorized to access this resource" });
    }
  }
}
