import { food_list } from "./utils/assets";

const tableBody = document.querySelector(".cart-items table tbody") as HTMLTableElement;
const subTotalElement = document.querySelector(".totals .subtotal-price") as HTMLParagraphElement;
const totalElement = document.querySelector(".totals .total-price") as HTMLParagraphElement;
let subtotal: number;

for (let food of food_list) {
  const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
  if (!cartItemsCount || cartItemsCount === "0") continue;
  const tr = document.createElement("tr");
  tableBody.appendChild(tr);
  const item = document.createElement("td");
  item.classList.add("item");
  tr.appendChild(item);
  const img = document.createElement("img");
  img.src = food.image;
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
  remove.addEventListener("click", () => {
    subtotal -= +cartItemsCount * food.price;
    subTotalElement.textContent = `$${subtotal}`;
    totalElement.textContent = subtotal === 0 ? "$0" : `$${subtotal + 2}`;
    tr.remove();
    sessionStorage.removeItem(`cartItemsCount-${food._id}`);
    handleCartDot();
  });
}

calculateTotalPrice();
function calculateTotalPrice() {
  subtotal = 0;
  for (let food of food_list) {
    const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
    if (cartItemsCount) subtotal += +cartItemsCount * food.price;
  }
  subTotalElement.textContent = `$${subtotal}`;
  totalElement.textContent = subtotal === 0 ? "$0" : `$${subtotal + 2}`;
}

handleCartDot()
function handleCartDot() {
  const dot = document.querySelector(".cart-icon .dot") as HTMLDivElement;
  for (let food of food_list) {
    const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
    if (cartItemsCount && +cartItemsCount > 0) dot.style.visibility = "visible";
    else dot.style.visibility = "hidden";
    break;
  }
}
