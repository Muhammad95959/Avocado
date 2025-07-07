import type IFood from "./interfaces/IFood";
import handleCartDot from "./utils/handleCartDot";
import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const tableBody = document.querySelector(".cart-items table tbody") as HTMLTableElement;
const subTotalElement = document.querySelector(".totals .subtotal-price") as HTMLParagraphElement;
const totalElement = document.querySelector(".totals .total-price") as HTMLParagraphElement;
const proceedBtn = document.querySelector(".totals .proceed-btn");
const url = "http://localhost:4000";
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
  const tr = document.createElement("tr");
  tableBody.appendChild(tr);
  const item = document.createElement("td");
  item.classList.add("item");
  tr.appendChild(item);
  const img = document.createElement("img");
  img.src = `${url}/images/${food.image}`;
  item.appendChild(img);
  const title = document.createElement("td");
  title.classList.add("title");
  title.textContent = food.name;
  tr.appendChild(title);
  const price = document.createElement("td");
  price.classList.add("price");
  price.textContent = `$${food.price}`;
  tr.appendChild(price);
  const quantity = document.createElement("td");
  quantity.classList.add("quantity");
  quantity.textContent = cartItemsCount;
  tr.appendChild(quantity);
  const total = document.createElement("td");
  total.classList.add("total");
  total.textContent = `$${+cartItemsCount * food.price}`;
  tr.appendChild(total);
  const remove = document.createElement("td");
  remove.classList.add("remove");
  remove.textContent = "x";
  remove.tabIndex = 0;
  tr.appendChild(remove);
  remove.addEventListener("click", async () => {
    subtotal -= +cartItemsCount * food.price;
    subTotalElement.textContent = `$${subtotal}`;
    totalElement.textContent = subtotal === 0 ? "$0" : `$${subtotal + 2}`;
    tr.remove();
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
  if (subtotal === 0) {
    new Notyf({ duration: 3000 }).error("No Items");
    e.preventDefault();
  }
});
