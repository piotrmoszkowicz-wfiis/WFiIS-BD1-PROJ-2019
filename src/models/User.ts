import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from "sequelize-typescript";

import Soldier from "@models/Soldier";
import Wallet from "@models/Wallet";

import UserRights from "UserRights";

@Table({
  tableName: "game_users",
  underscored: true
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Unique
  @IsEmail
  @Column
  public email: string;

  @Column
  public password: string;

  @Column(DataType.ENUM("User", "Moderator", "Administrator"))
  public rights: UserRights;

  @HasMany(() => Wallet, "userId")
  public wallets: Wallet[];

  @HasMany(() => Soldier, "userId")
  public soldiers: Soldier[];

  @CreatedAt
  public createdAt: Date;

  @DeletedAt
  public deletedAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
