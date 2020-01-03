import { Op } from "sequelize";

import Item from "@models/Item";
import Offer from "@models/Offer";
import OwnedItem from "@models/OwnedItem";
import logger from "@utils/logger";

/**
 * Class representing ItemService, which does all operations connected with Items
 */
export default class ItemService {
  constructor(
    readonly itemModel = Item,
    readonly offerModel = Offer,
    readonly ownedItemModel = OwnedItem
  ) {}

  /**
   * Adds new item into the database
   * @param newItemData              - Data of new item
   */
  public async addItem(newItemData: Partial<Item>) {
    try {
      const newItem = new this.itemModel(newItemData);
      await newItem.save();

      return newItem.toJSON();
    } catch (err) {
      logger.log("error", "Error adding item", { newItemData, err });
      return undefined;
    }
  }

  /**
   * Deletes certain item from database
   * @param itemId              - ID of Item
   */
  public async deleteItem(itemId: number) {
    try {
      const result = await this.itemModel.destroy({
        where: {
          id: itemId
        }
      });

      if (!result) {
        return undefined;
      }

      return {
        deleted: true
      };
    } catch (err) {
      logger.log("error", "Error while deleting item", { itemId, err });
      return undefined;
    }
  }

  /**
   * Returns all items from the database
   */
  public async getAllItems() {
    return this.itemModel
      .findAll()
      .then(items => items.map(item => item.toJSON()));
  }

  /**
   * Returns certain item from database with offers
   * @param itemId              - ID of Item
   */
  public getItemWithOffers(itemId: number) {
    return this.itemModel.findByPk(itemId, {
      include: [
        {
          model: this.offerModel
        }
      ]
    });
  }

  /**
   * Functions which grabs all items with information whether certain soldier owns them
   * @param soldierId     - ID of Soldier
   * @param types         - Type of items
   * @param kitId?         - Kit of Soldier
   */
  public getAllItemsWithOwnerBySoldierId(
    soldierId: number,
    types: string[],
    kitId?: number
  ) {
    const kitParams = [-1];
    if (kitId !== undefined) {
      kitParams.push(kitId);
    }
    return this.itemModel.findAll({
      include: [
        {
          model: this.ownedItemModel,
          where: {
            ownerId: soldierId
          },
          required: false
        },
        {
          model: Offer
        }
      ],
      where: {
        type: {
          [Op.or]: types
        },
        kit: {
          [Op.or]: kitParams
        }
      }
    });
  }

  /**
   * Functions which grabs all items that certain soldier owns
   * @param soldierId     - ID of Soldier
   * @param types         - Type of items
   * @param kitId?         - Kit of Soldier
   */
  public getOwnedItemsBySolderId(
    soldierId: number,
    types: string[],
    kitId?: number
  ) {
    const kitParams = [-1];
    if (kitId !== undefined) {
      kitParams.push(kitId);
    }
    return this.itemModel.findAll({
      include: [
        {
          model: this.ownedItemModel.scope(null),
          where: {
            ownerId: soldierId
          },
          required: true
        }
      ],
      where: {
        type: {
          [Op.or]: types
        },
        kit: {
          [Op.or]: kitParams
        }
      }
    });
  }

  /**
   * Functions, which equipps single item for certain soldier
   * @param ownerId      - ID of Soldier
   * @param itemId       - ID of Item
   * @param slot         - Slot to equip to
   */
  public equipItem(ownerId: number, itemId: number, slot: number) {
    return this.ownedItemModel
      .unscoped()
      .findOne({
        where: {
          ownerId,
          itemId
        }
      })
      .then(item => {
        if (!item) {
          return;
        }
        item.barPosition = slot;
        return item.save();
      });
  }

  /**
   * Functions, which deequips all items besides ones to equip
   * @param ownerId         - ID of Soldier
   * @param itemsToEquip    - Items, which won't be deequipped
   */
  public deequipAllItems(ownerId: number, itemsToEquip: number[]) {
    return this.ownedItemModel
      .unscoped()
      .findAll({
        where: {
          ownerId,
          barPosition: {
            [Op.ne]: -1
          }
        }
      })
      .then(items => {
        return items.forEach(item => {
          if (itemsToEquip.includes(item.itemId)) {
            return;
          }
          item.barPosition = -1;
          return item.save();
        });
      });
  }

  /**
   * Function, which equipps whole bar in a single call
   * @param ownerId         - Soldier ID
   * @param items           - Array of items to equip
   */
  public equipWholeBar(ownerId: number, items: number[]) {
    return this.deequipAllItems(ownerId, items).then(() => {
      return items.forEach((itemId, key) => {
        if (itemId === 0) {
          return;
        }
        return this.equipItem(ownerId, itemId, key);
      });
    });
  }
}
