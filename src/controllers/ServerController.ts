import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post
} from "routing-controllers";

import Server from "@models/Server";
import ServerService from "@services/ServerService";

@JsonController()
export default class ServerController {
  constructor(private serverService = new ServerService()) {}

  @Post("/server")
  @OnUndefined(400)
  public addServer(@Body({ required: true }) newServerData: Partial<Server>) {
    return this.serverService.addServer(newServerData);
  }

  @Get("/server")
  public getServers() {
    return this.serverService
      .getAllServers()
      .then(servers => servers.map(server => server.toJSON()));
  }

  @Get("/server/single/:serverId")
  @OnUndefined(400)
  public getServer(@Param("serverId") serverId: number) {
    return this.serverService
      .getServer(serverId)
      .then(server => server.toJSON());
  }

  @Delete("/server/:serverId")
  @OnUndefined(400)
  public deleteServer(@Param("serverId") serverId: number) {
    return this.serverService.deleteServer(serverId);
  }
}
