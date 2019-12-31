import _ from "lodash";
import {
  Body,
  Delete,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put
} from "routing-controllers";

import Offer from "@models/Offer";
import OfferService from "@services/OfferService";

@JsonController()
export default class OfferController {
  constructor(private offerService = new OfferService()) {}

  @Post("/offer")
  @OnUndefined(400)
  public addOffer(@Body({ required: true }) newOfferData: Omit<Offer, "id">) {
    return this.offerService.addOffer(newOfferData);
  }

  @Delete("/offer/:offerId")
  @OnUndefined(400)
  public deleteOffer(@Param("offerId") offerId: number) {
    return this.offerService.deleteOffer(offerId);
  }

  @Put("/offer/:offerId")
  @OnUndefined(400)
  public updateOffer(
    @Param("offerId") offerId: number,
    @Body({ required: true }) newOfferData: Partial<Offer>
  ) {
    return this.offerService.updateOffer(
      offerId,
      _.omit(newOfferData, ["id", "createdAt", "updatedAt", "deletedAt"])
    );
  }
}
