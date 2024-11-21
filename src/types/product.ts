export interface IProcedure {
  user_id: string;
  cart_itemCode: number | null;
  game_server: number | null;
  item_price: number | null;
}

export interface ITransaction {
  itemName: string;
  itemPrice: number;
  itemImage: string;
  userName: string;
}
