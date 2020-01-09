import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  createIndexDecorator,
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

const OwnedItemUniqueIndex = createIndexDecorator({ type: "UNIQUE" });

@DefaultScope(() => ({
  attributes: ["id", "availableTill", "barPosition", "createdAt", "useCount"]
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

  // @ts-ignore
  @OwnedItemUniqueIndex({ name: "owner_id" })
  @ForeignKey(() => Soldier)
  @Column
  public ownerId: number;

  // @ts-ignore
  @OwnedItemUniqueIndex({ name: "item_id" })
  @ForeignKey(() => Item)
  @Column
  public itemId: number;

  @Column
  public useCount: number;

  @Column
  public barPosition: number;

  @CreatedAt
  public createdAt: Date;

  // @ts-ignore
  @OwnedItemUniqueIndex({ name: "deleted_at" })
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

  @BelongsTo(() => Soldier)
  public soldierData: Soldier;
}
