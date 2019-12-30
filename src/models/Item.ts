import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

import Offer from "@models/Offer";
import OwnedItem from "@models/OwnedItem";

import ItemCategory from "ItemCategory";
import ItemType from "ItemType";
import ValidationGroup from "ValidationGroup";

@Table({
  tableName: "game_items",
  timestamps: false,
  underscored: true
})
export default class Item extends Model<Item> {
  @PrimaryKey
  @Column
  public id: number;

  @Column(
    DataType.ENUM("abilities", "appearance", "boosters", "gadget", "weapons")
  )
  public type: ItemType;

  @Column
  public name: string;

  @Column(
    DataType.ENUM(
      "assault_rifle",
      "accessory1",
      "accessory2",
      "booster_9000",
      "booster_9005",
      "face",
      "gadget",
      "head",
      "lmg",
      "melee",
      "pistol",
      "shotgun",
      "smg",
      "sniper_rifle",
      "uniform"
    )
  )
  public category: ItemCategory;

  @Column(DataType.TEXT)
  public description: string;

  @Column(DataType.JSONB)
  public stats: string;

  @Column
  public kit: number;

  @Column
  public buyable: boolean;

  @Column(DataType.ENUM("primary", "secondary", "melee", "gadget"))
  public validationGroup?: ValidationGroup;

  @Column
  public lockCriteria: number;

  @HasOne(() => OwnedItem, "itemId")
  public ownerData: OwnedItem;

  @HasMany(() => Offer, "itemId")
  public offers: Offer[];
}
