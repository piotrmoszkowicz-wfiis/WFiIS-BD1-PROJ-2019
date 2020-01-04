import Server from "@models/Server";
import Round from "@models/Round";
import logger from "@utils/logger";

/**
 * Class representing ServerService, which does all operations connected with Servers
 */
export default class ServerService {
  constructor(readonly serverModel = Server, readonly roundModel = Round) {}

  /**
   * Adds new server into the database
   * @param newServerData              - Data of new server
   */
  public async addServer(newServerData: Partial<Server>) {
    try {
      const newServer = new this.serverModel(newServerData);
      await newServer.save();

      return newServer.toJSON();
    } catch (err) {
      logger.log("error", "Error adding server", { newServerData, err });
      return undefined;
    }
  }

  /**
   * Deletes certain item from database
   * @param serverId              - ID of Item
   */
  public async deleteServer(serverId: number) {
    try {
      const result = await this.serverModel.destroy({
        where: {
          id: serverId
        }
      });

      if (!result) {
        return undefined;
      }

      return {
        deleted: true
      };
    } catch (err) {
      logger.log("error", "Error while deleting server", { serverId, err });
      return undefined;
    }
  }

  /**
   * Function which grabs all servers from DB
   */
  public getAllServers() {
    return this.serverModel.findAll();
  }

  /**
   * Function which grabs all online servers from DB
   */
  public getOnlineServers() {
    return this.serverModel.findAll({
      where: {
        online: true
      }
    });
  }

  /**
   * Function, which grabs single server from DB
   * @param serverId              - ID of Server
   */
  public getServer(serverId: number) {
    return this.serverModel.findByPk(serverId, {
      include: [
        {
          model: this.roundModel,
          required: false
        }
      ]
    });
  }
}
