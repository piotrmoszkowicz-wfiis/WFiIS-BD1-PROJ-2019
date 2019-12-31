import Server from "@models/Server";

/**
 * Class representing ServerService, which does all operations connected with Servers
 */
export default class ServerService {
  constructor(readonly serverModel = Server) {}

  /**
   * Function which grabs all online server from DB
   */
  public getAllServers() {
    return this.serverModel.findAll({
      where: {
        online: true
      }
    });
  }
}
