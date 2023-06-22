// import { IListProduct, IProduct } from "../interface/Products";
import { formatId } from "../utils/utils";
import { DefaultItemFactory, PerformaItemFactory } from "./ProductsFactory";
import { IProduct } from "../interface/Products";

export class ListItemsFactory {
  public item_list_name: string;
  public item_list_id: string;
  public item_list_items: Element[];

  private list_id: string;

  constructor(listName: string, listId: string, listItems: Element[]) {
    this.item_list_name = listName;
    this.item_list_id = formatId(this.item_list_name);
    this.list_id = listId;
    this.item_list_items = listItems;
  }

  /**
   * getList
   */
  public getList() {
    return this.listBuilder();
  }

  private listBuilder() {
    const productItems = this.item_list_items.map((item, index) =>
      this.handleSelectBuilder(item, index)
    );

    return {
      item_list_id: formatId(this.item_list_name),
      item_list_name: this.item_list_name.trim(),
      items: productItems as IProduct[],
    };
  }

  private handleSelectBuilder(item: Element, index: number) {
    let newList;

    switch (this.list_id) {
      case "default":
        newList = new DefaultItemFactory(item, index, this.item_list_name);
        break;
      case "performa":
        newList = new PerformaItemFactory(item, index, this.item_list_name);
        break;
      case "category":
        newList = new DefaultItemFactory(item, index, this.item_list_name);
        break;
    }

    return newList?.getItem();
  }
}
