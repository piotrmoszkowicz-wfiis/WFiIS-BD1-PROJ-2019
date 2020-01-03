import Offer from "@models/Offer";
import logger from "@utils/logger";

/**
 * Class representing service, which handles all Offer-related operations
 */
export default class OfferService {
  constructor(readonly offerModel = Offer) {}

  /**
   * Adds new offer into the database
   * @param newOfferData              - Data of new offer
   */
  public async addOffer(newOfferData: Omit<Offer, "id">) {
    try {
      const newOffer = new this.offerModel(newOfferData);
      await newOffer.save();

      return newOffer.toJSON();
    } catch (err) {
      logger.log("error", "Error while adding offer", { newOfferData, err });
      return undefined;
    }
  }

  /**
   * Deleted offer from database
   * @param id                        - ID of Offer to delete
   */
  public async deleteOffer(id: number) {
    try {
      const result = await this.offerModel.destroy({
        where: {
          id
        }
      });

      logger.log("debug", "delete result", { result });

      if (!result) {
        return undefined;
      }

      return {
        deleted: true
      };
    } catch (err) {
      logger.log("error", "Error while deleting offer", { id, err });
      return undefined;
    }
  }

  /**
   * Updates currently existing offer
   * @param id                        - ID of Offer to update
   * @param newOfferData              - Updates data
   */
  public async updateOffer(id: number, newOfferData: Partial<Offer>) {
    try {
      const result = await this.offerModel.update<Offer>(newOfferData, {
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
      logger.log("error", "Error while updating offer", {
        offerData: newOfferData,
        id,
        err
      });
      return undefined;
    }
  }
}
