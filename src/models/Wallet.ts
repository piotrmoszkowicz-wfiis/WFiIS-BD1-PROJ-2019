import {
  AutoIncrement,
  Column,
  CreatedAt, createIndexDecorator,
  DataType,
  DefaultScope,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";

import User from "@models/User";

import Currency from "Currency";

const WalletUniqueIndex = createIndexDecorator({ type: "UNIQUE" });

@DefaultScope(() => ({
  attributes: ["currency", "value"]
}))
@Table({
  tableName: "game_wallets",
  underscored: true
})
export default class Wallet extends Model<Wallet> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  // @ts-ignore
  @WalletUniqueIndex({ name: "user_id" })
  @ForeignKey(() => User)
  @Column
  public userId: number;

  // @ts-ignore
  @WalletUniqueIndex({ name: "currency" })
  @Column(DataType.ENUM("_PF", "_AC"))
  public currency: Currency;

  @Column
  public value: number;

  @CreatedAt
  public createdAt: Date;

  @DeletedAt
  public deletedAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
