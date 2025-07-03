import { food_list } from "./assets";

export default function handleCartDot() {
  const dot = document.querySelector(".cart-icon .dot") as HTMLDivElement;
  for (let food of food_list) {
    const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
    if (cartItemsCount && +cartItemsCount > 0) {
      dot.style.visibility = "visible";
      return;
    }
  }
  dot.style.visibility = "hidden";
}

