import type IFood from "./interfaces/IFood";
import handleCartDot from "./utils/handleCartDot";
import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const table = document.querySelector(".cart-items .table") as HTMLTableElement;
const subTotalElement = document.querySelector(".totals .subtotal-price") as HTMLParagraphElement;
const totalElement = document.querySelector(".totals .total-price") as HTMLParagraphElement;
const proceedBtn = document.querySelector(".totals .proceed-btn");
const url = "https://avocado-production-778f.up.railway.app";
let subtotal: number;
let cartData: Record<string, string> = {};

handleCartDot();

let foodList: IFood[] = [];
const foodListStr = sessionStorage.getItem("foodList");
if (!foodListStr) {
  const response = await axios.get(`${url}/api/v1/food/list`);
  foodList = response.data.data as IFood[];
} else foodList = JSON.parse(foodListStr);
for (let food of foodList) {
  const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
  if (!cartItemsCount || cartItemsCount === "0") continue;
  cartData[food._id] = cartItemsCount;
  table.appendChild(document.createElement("hr"));
  const row = document.createElement("div");
  table.appendChild(row);
  row.classList.add("row");
  row.innerHTML = `
    <img src=${url}/images/${food.image} />
    <p class="title">${food.name}</p>
    <p class="price">$${food.price}</p>
    <p class="quantity">${cartItemsCount}</p>
    <p class="total">$${+cartItemsCount * food.price}</p>
    <p class="remove">x</p>
  `;
  const remove = row.querySelector(".remove") as HTMLParagraphElement;
  remove.addEventListener("click", async () => {
    subtotal -= +cartItemsCount * food.price;
    subTotalElement.textContent = `$${subtotal}`;
    totalElement.textContent = subtotal === 0 ? "$0" : `$${subtotal + 2}`;
    (row.previousSibling as HTMLHRElement).remove();
    row.remove();
    sessionStorage.removeItem(`cartItemsCount-${food._id}`);
    handleCartDot();
    delete cartData[food._id];
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.patch(`${url}/api/v1/cart/update`, { cartData }, { headers: { token } });
      console.log(response);
    }
  });
}

calculateTotalPrice();
function calculateTotalPrice() {
  subtotal = 0;
  for (let food of foodList) {
    const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
    if (cartItemsCount) subtotal += +cartItemsCount * food.price;
  }
  subTotalElement.textContent = `$${subtotal}`;
  totalElement.textContent = subtotal === 0 ? "$0" : `$${subtotal + 2}`;
}

proceedBtn?.addEventListener("click", (e) => {
  const notyf = new Notyf({ duration: 3000 });
  if (subtotal === 0) {
    e.preventDefault();
    notyf.error("No Items");
  }
  if (!localStorage.getItem("token")) {
    e.preventDefault();
    notyf.error("Please login first");
  }
});
