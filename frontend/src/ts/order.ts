import { food_list } from "./utils/assets";
import handleCartDot from "./utils/handleCartDot";

const subTotalElement = document.querySelector(".totals .subtotal-price") as HTMLParagraphElement;
const totalElement = document.querySelector(".totals .total-price") as HTMLParagraphElement;
let subtotal: number;

handleCartDot();

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
