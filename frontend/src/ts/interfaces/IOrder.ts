import type IFood from "./IFood";

interface Food extends IFood{
  quantity: number;
}

export default interface IOrder {
  userId: number;
  items: Food[];
  amount: number;
  address: string;
  status: string;
  date: Date;
  payment: string;
}
