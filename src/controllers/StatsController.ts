import { Controller, Get } from "routing-controllers";

import ServerService from "@services/ServerService";
import SoldierService from "@services/SoldierService";
import UserService from "@services/UserService";

import logger from "@utils/logger";

@Controller()
export default class StatusController {
  constructor(
    private serverService = new ServerService(),
    private soldierService = new SoldierService(),
    private userService = new UserService()
  ) {}

  @Get("/stats")
  public async stats(): Promise<any> {
    try {
      const servers = await this.serverService.getServersCount();
      const soldiers = await this.soldierService.getSoldiersCountByClass();
      const users = await this.userService.getUsersCount();
      const soldiersWithoutRounds = await this.soldierService.getSoldiersCountWithoutRounds();

      return {
        servers,
        soldiers,
        soldiersWithoutRounds: soldiersWithoutRounds[0],
        users: users[0]
      };
    } catch (err) {
      logger.log("error", "Error on stats endpoint", { err });
    }
  }
}
