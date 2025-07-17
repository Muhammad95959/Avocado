import type IFood from "../interfaces/IFood";
import axios from "axios";

const url = "https://avocado-production-778f.up.railway.app";

export default async function handleCartDot() {
  const dot = document.querySelector(".cart-icon .dot") as HTMLDivElement;
  const response = await axios.get(`${url}/api/v1/food/list`);
  const foodList = response.data.data as IFood[];
  for (let food of foodList) {
    const cartItemsCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
    if (cartItemsCount && +cartItemsCount > 0) {
      dot.style.visibility = "visible";
      return;
    }
  }
  dot.style.visibility = "hidden";
}
