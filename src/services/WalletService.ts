import Wallet from "@models/Wallet";

import { WalletBalance } from "WalletBalance";

/**
 * Class representing WalletService, which handles all operations connected with wallets
 */
export default class WalletService {
  constructor(readonly modelWallet = Wallet) {}

  /**
   * Gets wallet JSON response for certain user by UserID
   * @param userId          - UserID
   */
  public getWalletJsonByUserId(userId: number): Promise<WalletBalance> {
    return this.getWalletByUserId(userId).then(WalletService.parseWallet);
  }

  /**
   * Gets wallet for certain user by UserID
   * @param userId          - UserID
   */
  private getWalletByUserId(userId: number) {
    return this.modelWallet.findAll({
      where: {
        userId
      }
    });
  }

  /**
   * Parses wallet DB response
   * @param wallet      - DB Wallet rows
   */
  private static parseWallet(wallet: Wallet[]) {
    return wallet.reduce<WalletBalance>(
      (convertedWallet, singleWallet) => {
        convertedWallet[singleWallet.currency] = singleWallet.value;
        return convertedWallet;
      },
      {
        _PF: 0,
        _AC: 0
      }
    );
  }
}
