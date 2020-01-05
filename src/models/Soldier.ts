import {
  AutoIncrement,
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt
} from "sequelize-typescript";

import OwnedItem from "@models/OwnedItem";
import RoundStats from "@models/RoundStats";
import User from "@models/User";
import Wallet from "@models/Wallet";

@Scopes(() => ({
  full: {
    include: [Wallet]
  },
  wallet: {
    attributes: [],
    include: [Wallet]
  }
}))
@Table({
  tableName: "game_soldiers",
  underscored: true
})
export default class Soldier extends Model<Soldier> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Unique
  @Column
  public soldierName: string;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @Column
  public online: number;

  @Column
  public ipAddress: string;

  @Default(1)
  @Column
  public level: number;

  @Column
  public kit: number;

  @Default(0)
  @Column
  public xp: number;

  @Column
  public isMain: boolean;

  @CreatedAt
  public createdAt: Date;

  @DeletedAt
  public deletedAt: Date;

  @UpdatedAt
  public updatedAt: Date;

  @HasMany(() => OwnedItem, "ownerId")
  public items: OwnedItem[];

  @HasMany(() => RoundStats, "soldierId")
  public roundsStats: RoundStats[];
}
