import Soldier from "@models/Soldier";
import OwnedItem from "@models/OwnedItem";
import RoundStats from "@models/RoundStats";
import Item from "@models/Item";
import logger from "@utils/logger";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

/**
 * Class representing SoldierService, which does all operations connected with Soldiers
 */
export default class SoldierService {
  constructor(
    readonly modelSoldier = Soldier,
    readonly modelOwnedItem = OwnedItem,
    readonly modelRoundStats = RoundStats,
    readonly modelItem = Item
  ) {}

  /**
   * Adds new item into the database
   * @param newSoldierData              - Data of new soldier
   */
  public async addSoldier(newSoldierData: Partial<Soldier>) {
    try {
      const newSoldier = new this.modelSoldier(newSoldierData);
      await newSoldier.save();

      return newSoldier.toJSON();
    } catch (err) {
      logger.log("error", "Error adding soldier", { newSoldierData, err });
      return undefined;
    }
  }

  /**
   * Deletes certain soldier from database
   * @param soldierId              - ID of Soldier
   */
  public async deleteSoldier(soldierId: number) {
    try {
      const result = await this.modelSoldier.destroy({
        where: {
          id: soldierId
        }
      });

      if (!result) {
        return undefined;
      }

      return {
        deleted: true
      };
    } catch (err) {
      logger.log("error", "Error while deleting soldier", { soldierId, err });
      return undefined;
    }
  }

  /**
   * Returns all soldiers by userId
   * @param userId          - UserID
   * @param attributes      - Attributes, which we want to get
   */
  public getSoldiersByUserId(userId: number, attributes?: string[]) {
    const opts = {
      where: {
        userId
      }
    } as {
      attributes?: string[];
    };
    if (attributes) {
      opts.attributes = attributes;
    }
    return this.modelSoldier.findAll(opts);
  }

  /**
   * Gets single soldier by it's ID
   * @param id              - SoldierID
   * @param attributes      - Attributes, which we want to get
   */
  public getSoldierByID(id: number, attributes?: string[]) {
    const opts = {} as {
      attributes?: string[];
    };
    if (attributes) {
      opts.attributes = attributes;
    }
    return this.modelSoldier.findByPk(id, opts);
  }

  /**
   * Get count of all soldiers by kit
   */
  public getSoldiersCountByClass(): Promise<any> {
    return this.modelSoldier.findAll({
      attributes: [
        "kit",
        [Sequelize.fn("COUNT", Sequelize.col("kit")), "soldierCount"]
      ],
      group: ["kit"],
      raw: true
    });
  }

  /**
   * Gets count of all soldiers without any rounds played
   */
  public getSoldiersCountWithoutRounds(): Promise<any> {
    return this.modelSoldier.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Soldier.id")), "soldierCount"]
      ],
      having: Sequelize.where(
        Sequelize.fn("COUNT", Sequelize.col("roundsStats.id")),
        {
          [Op.lt]: 1
        }
      ),
      group: ["Soldier.id"],
      raw: true,
      include: [
        {
          attributes: [],
          model: this.modelRoundStats
        }
      ]
    });
  }

  /**
   * Gets single soldier by it's ID with full data
   * @param id               - SoldierID
   */
  public getFullSoldierByID(id: number) {
    return this.modelSoldier.findByPk(id, {
      include: [
        {
          model: this.modelOwnedItem,
          required: false,
          include: [
            {
              model: this.modelItem,
              required: true
            }
          ]
        },
        {
          model: this.modelRoundStats,
          required: false
        }
      ]
    });
  }

  /**
   * Updates currently existing offer
   * @param id                          - ID of Soldier to update
   * @param newSoldierData              - Updates data
   */
  public async updateSoldier(id: number, newSoldierData: Partial<Soldier>) {
    try {
      const result = await this.modelSoldier.update<Soldier>(newSoldierData, {
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
      logger.log("error", "Error while updating soldier", {
        newSoldierData,
        id,
        err
      });
      return undefined;
    }
  }
}
