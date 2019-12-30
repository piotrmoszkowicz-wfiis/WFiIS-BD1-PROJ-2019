import { Controller, Get, Req, Res } from "routing-controllers";

import { Request, Response } from "express";

@Controller()
export default class StatusController {
  @Get("/status")
  public status(@Req() request: Request, @Res() response: Response): Response {
    return response.send("OK");
  }
}
