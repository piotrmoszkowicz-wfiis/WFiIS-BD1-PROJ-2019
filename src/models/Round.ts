import {
  AutoIncrement,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

import RoundStats from "@models/RoundStats";
import Server from "@models/Server";

@Table({
  tableName: "game_rounds",
  underscored: true
})
export default class Round extends Model<Round> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  @ForeignKey(() => Server)
  public serverId: number;

  @HasMany(() => RoundStats, "roundId")
  public roundStats: RoundStats[];
}
