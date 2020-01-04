import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post
} from "routing-controllers";

import ItemService from "@services/ItemService";
import Item from "@models/Item";
import OwnedItem from "@models/OwnedItem";

@JsonController()
export default class ItemController {
  constructor(private itemService = new ItemService()) {}

  @Post("/item")
  @OnUndefined(400)
  public addItem(@Body({ required: true }) newItemData: Partial<Item>) {
    return this.itemService.addItem(newItemData);
  }

  @Post("/item/give")
  @OnUndefined(400)
  public giveItem(
    @Body({ required: true }) newOwnedItemData: Partial<OwnedItem>
  ) {
    return this.itemService.giveItem(newOwnedItemData);
  }

  @Get("/item")
  public getItems() {
    return this.itemService.getAllItems();
  }

  @Get("/item/single/:itemId")
  @OnUndefined(400)
  public getItem(@Param("itemId") itemId: number) {
    return this.itemService
      .getItemWithOffers(itemId)
      .then(item => item.toJSON());
  }

  @Delete("/item/:itemId")
  @OnUndefined(400)
  public deleteItem(@Param("itemId") itemId: number) {
    return this.itemService.deleteItem(itemId);
  }
}
