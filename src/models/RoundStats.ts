import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";

import Soldier from "@models/Soldier";
import Round from "@models/Round";

@Table({
  tableName: "game_soldiers_round_stats",
  underscored: true
})
export default class RoundStats extends Model<RoundStats> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  @ForeignKey(() => Soldier)
  public soldierId: number;

  @Column
  @ForeignKey(() => Round)
  public roundId: number;

  @Column
  public kills: number;

  @Column
  public deaths: number;

  @Column
  public points: number;

  @Column
  public flagsCaptured: number;

  @Column
  public flagsNeutralized: number;
}
