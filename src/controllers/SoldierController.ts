import _ from "lodash";
import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put
} from "routing-controllers";

import Soldier from "@models/Soldier";
import SoldierService from "@services/SoldierService";

@JsonController()
export default class SoldierController {
  constructor(private soldierService = new SoldierService()) {}

  @Post("/soldier")
  @OnUndefined(400)
  public addSoldier(
    @Body({ required: true }) newSoldierData: Omit<Soldier, "id">
  ) {
    return this.soldierService.addSoldier(newSoldierData);
  }

  @Delete("/soldier/:soldierId")
  @OnUndefined(400)
  public deleteSoldier(@Param("soldierId") soldierId: number) {
    return this.soldierService.deleteSoldier(soldierId);
  }

  @Get("/soldier/:soldierId")
  @OnUndefined(400)
  public getSoldier(@Param("soldierId") soldierId: number) {
    return this.soldierService
      .getFullSoldierByID(soldierId)
      .then(soldier => soldier.toJSON());
  }

  @Put("/soldier/:soldierId")
  @OnUndefined(400)
  public updateSoldier(
    @Param("soldierId") soldierId: number,
    @Body({ required: true }) newSoldierData: Partial<Soldier>
  ) {
    return this.soldierService.updateSoldier(
      soldierId,
      _.omit(newSoldierData, ["id", "createdAt", "updatedAt", "deletedAt"])
    );
  }
}
