import type IOrder from "./interfaces/IOrder";
import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const ordersContent = document.querySelector(".orders-content") as HTMLDivElement;
const url = "http://localhost:4000";

const response = await axios.get(`${url}/api/v1/order/list`);
if (response.data.success) {
  const orders = response.data.data as IOrder[];
  createOrdersElements(orders);
} else {
  console.log(response.data.message);
  new Notyf({ duration: 5000 }).error(response.data.message);
}

function createOrdersElements(orders: IOrder[]) {
  orders.forEach((order) => {
    const orderElement = document.createElement("div");
    orderElement.classList.add("order");
    orderElement.innerHTML = `
      <img src="src/assets/parcel_icon.png" />
      <div class="info">
        <p class="items">${order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</p>
        <p class="name">${order.address.firstName} ${order.address.lastName}</p>
        <p class="street">${order.address.street}</p>
        <p class="rest-address">${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipCode}</p>
        <p class="phone">${order.address.phone}</p>
      </div>
      <div class="price">$${order.amount}</div>
      <div class="count">Items: ${order.items.length}</div>
      <select name="status">
        <option value="Food Processing">Food Processing</option>
        <option value="Out for delivery">Out for delivery</option>
        <option value="Delivered">Delivered</option>
      </select>
`;
    ordersContent.appendChild(orderElement);
  });
}
