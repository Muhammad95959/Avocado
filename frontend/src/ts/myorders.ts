import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";
import type IOrder from "./interfaces/IOrder";

const ordersElement = document.querySelector(".my-orders .orders") as HTMLDivElement;
const url = "http://localhost:4000";
const token = localStorage.getItem("token");

if (!token) window.location.replace("index.html");

const response = await axios.get(`${url}/api/v1/order/userorders`, { headers: { token } });
if (response.data.success) {
  const orders = response.data.data as IOrder[];
  createOrdersElements(orders);
  (document.querySelector(".spinner") as HTMLDivElement).remove();
} else {
  console.log(response.data.message);
  new Notyf({ duration: 5000 }).error(response.data.message);
}

function createOrdersElements(orders: IOrder[]) {
  orders.forEach((order, index) => {
    const orderElement = document.createElement("div");
    orderElement.classList.add("order");
    ordersElement.appendChild(orderElement);
    const img = document.createElement("img");
    img.src = "src/assets/icon_parcel.png";
    orderElement.appendChild(img);
    const items = document.createElement("div");
    items.classList.add("items");
    const itemsDetails = order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ");
    items.textContent = itemsDetails;
    orderElement.appendChild(items);
    const price = document.createElement("div");
    price.classList.add("price");
    price.textContent = `$${order.amount}`;
    orderElement.appendChild(price);
    const count = document.createElement("div");
    count.classList.add("count");
    count.textContent = `Items: ${order.items.length}`;
    orderElement.appendChild(count);
    const status = document.createElement("div");
    status.classList.add("status");
    status.innerHTML = `<span>&#x25cf;</span><b>${order.status}</b>`;
    orderElement.appendChild(status);
    const trackBtn = document.createElement("button");
    trackBtn.textContent = "Track Order";
    orderElement.appendChild(trackBtn);
    trackBtn.addEventListener("click", async (e) => {
      const response = await axios.get(`${url}/api/v1/order/userorders`, { headers: { token } });
      const notyf = new Notyf({ duration: 3000 });
      if (response.data.success) {
        const statusElement = (e.target as HTMLButtonElement).parentElement?.querySelector(".status b") as HTMLDivElement;
        const status = response.data.data[index].status;
        statusElement.textContent = status;
        notyf.success("Status updated successfully");
      } else {
        console.log(response.data.message);
        notyf.error("Something went wrong");
      }
    });
  });
}
