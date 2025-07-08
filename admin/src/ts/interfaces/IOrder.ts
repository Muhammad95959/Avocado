export default interface IOrder {
  _id: string;
  userId: number;
  items: IFood[];
  amount: number;
  address: IAddress;
  status: string;
  date: Date;
  payment: string;
}

interface IFood {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
}

interface IAddress {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}
