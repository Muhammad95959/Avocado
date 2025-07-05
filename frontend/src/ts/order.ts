import type IFood from "./interfaces/IFood";
import handleCartDot from "./utils/handleCartDot";
import axios from "axios";

const subTotalElement = document.querySelector(".totals .subtotal-price") as HTMLParagraphElement;
const totalElement = document.querySelector(".totals .total-price") as HTMLParagraphElement;
const url = "http://localhost:4000";
let subtotal: number;

handleCartDot();

calculateTotalPrice();
async function calculateTotalPrice() {
  subtotal = 0;
  let foodList: IFood[] = [];
  const foodListStr = sessionStorage.getItem("foodList");
  if (!foodListStr) {
    const response = await axios.get(`${url}/api/v1/food/list`);
    foodList = response.data.data as IFood[];
  } else foodList = JSON.parse(foodListStr);
  for (let food of foodList) {
    const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
    if (cartItemsCount) subtotal += +cartItemsCount * food.price;
  }
  subTotalElement.textContent = `$${subtotal}`;
  totalElement.textContent = subtotal === 0 ? "$0" : `$${subtotal + 2}`;
}
