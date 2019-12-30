import Soldier from "@models/soldier";

export default class SoldierService {
  constructor(readonly modelSoldier = Soldier) {}

  /**
   * Returns all soldiers by userId
   * @param userId          - UserID
   * @param attributes      - Attributes, which we want to get
   */
  public getSoldiersByUserId(userId: number, attributes?: string[]) {
    const opts = {
      where: {
        userId
      }
    } as {
      attributes?: string[];
    };
    if (attributes) {
      opts.attributes = attributes;
    }
    return this.modelSoldier.findAll(opts);
  }

  /**
   * Gets single soldier by it's ID
   * @param id              - SoldierID
   * @param attributes      - Attributes, which we want to get
   */
  public getSoldierByID(id: number, attributes?: string[]) {
    const opts = {
      where: {
        id
      }
    } as {
      attributes?: string[];
    };
    if (attributes) {
      opts.attributes = attributes;
    }
    return this.modelSoldier.findOne(opts);
  }
}
