import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType, Default,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";

import Round from "@models/Round";

import ServerRegion from "ServerRegion";

@Table({
  tableName: "game_servers",
  underscored: true
})
export default class Server extends Model<Server> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  public name: string;

  @Column
  public password: string;

  @Column
  public guid: string;

  @Column(DataType.ENUM("gva", "sjc", "iad", "nrt", "syd"))
  public region: ServerRegion;

  @Column(DataType.JSONB)
  public currentPlayers: string;

  @Default(0)
  @Column({
    field: "num_current_players"
  })
  public numberOfCurrentPlayers: number;

  @Default(32)
  @Column
  public capacity: number;

  @Column
  public ip: string;

  @Default(false)
  @Column
  public online: boolean;

  @Default(false)
  @Column
  public ranked: boolean;

  @Default("[\"1:1\"]")
  @Column(DataType.JSONB)
  public mapList: string[];

  @Default("3")
  @Column
  public roundsPerMap: string;

  @Default("1")
  @Column
  public currentRound: string;

  @Default(0)
  @Column
  public currentMap: number;

  @HasMany(() => Round, "serverId")
  public rounds: Round[];

  @CreatedAt
  public createdAt: Date;

  @DeletedAt
  public deletedAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
