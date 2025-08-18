import type IFood from "./interfaces/IFood";
import handleCartDot from "./utils/handleCartDot";
import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const infoForm = document.querySelector(".delivery form") as HTMLFormElement;
const subTotalElement = document.querySelector(".totals .subtotal-price") as HTMLParagraphElement;
const totalElement = document.querySelector(".totals .total-price") as HTMLParagraphElement;
const url = "http://localhost:4000";
let subtotal: number;
let items: IFood[] = [];

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
    if (cartItemsCount && +cartItemsCount > 0) {
      (food as any).quantity = cartItemsCount;
      items.push(food);
      subtotal += +cartItemsCount * food.price;
    }
  }
  subTotalElement.textContent = `$${subtotal}`;
  totalElement.textContent = subtotal === 0 ? "$0" : `$${subtotal + 2}`;
}

infoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (subtotal === 0) {
    new Notyf({ duration: 3000 }).error("No Items");
    return;
  }
  const address = {
    firstName: (document.querySelector('input[name="firstName"]') as HTMLInputElement).value,
    lastName: (document.querySelector('input[name="lastName"]') as HTMLInputElement).value,
    email: (document.querySelector('.delivery input[name="email"]') as HTMLInputElement).value,
    street: (document.querySelector('input[name="street"]') as HTMLInputElement).value,
    city: (document.querySelector('input[name="city"]') as HTMLInputElement).value,
    state: (document.querySelector('input[name="state"]') as HTMLInputElement).value,
    zipCode: (document.querySelector('input[name="zipCode"]') as HTMLInputElement).value,
    country: (document.querySelector('input[name="country"]') as HTMLInputElement).value,
    phone: (document.querySelector('input[name="phone"]') as HTMLInputElement).value,
  };
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${url}/api/v1/order/place`,
    { items, amount: subtotal + 2, address },
    { headers: { token } },
  );
  console.log(response);
  if (response.data.success) {
    const session_url = response.data.session_url;
    window.location.replace(session_url);
  } else alert("Error");
});
