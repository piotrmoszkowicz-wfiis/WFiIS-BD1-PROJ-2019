import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DefaultScope,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";

import Item from "@models/Item";
import Soldier from "@models/Soldier";

@DefaultScope(() => ({
  attributes: ["availableTill", "barPosition", "createdAt", "useCount"]
}))
@Table({
  tableName: "game_owned_items",
  underscored: true
})
export default class OwnedItem extends Model<OwnedItem> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @ForeignKey(() => Soldier)
  @Column
  public ownerId: number;

  @ForeignKey(() => Item)
  @Column
  public itemId: number;

  @Column
  public useCount: number;

  @Column
  public barPosition: number;

  @CreatedAt
  public createdAt: Date;

  @DeletedAt
  public deletedAt: Date;

  @UpdatedAt
  public updatedAt: Date;

  @Column({
    field: "available_till"
  })
  public availableTill: string;

  @BelongsTo(() => Item)
  public itemData: Item;
}
