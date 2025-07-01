import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const table = document.querySelector(".foods-list .table") as HTMLDivElement;
const url = "http://localhost:4000";
let foodList;

axios.get(`${url}/api/v1/food/list`).then((response) => {
  const notyf = new Notyf({ duration: 5000 });
  if (response.data.success) {
    foodList = response.data.data as any[];
    console.log(foodList);
    foodList.forEach((item) => {
      const row = document.createElement("div");
      row.classList.add("row");
      table.appendChild(row);
      const img = document.createElement("img");
      img.classList.add("image");
      img.src = `${url}/images/${item.image}`;
      row.appendChild(img);
      const name = document.createElement("p");
      name.classList.add("name");
      name.textContent = item.name;
      row.appendChild(name);
      const category = document.createElement("p");
      category.classList.add("category");
      category.textContent = item.category;
      row.appendChild(category);
      const price = document.createElement("p");
      price.classList.add("price");
      price.textContent = `$${item.price}`;
      row.appendChild(price);
      const action = document.createElement("p");
      action.classList.add("action");
      action.textContent = "X";
      row.appendChild(action);
      action.addEventListener("click", async (e) => {
        const remove = e.target as HTMLParagraphElement;
        remove.parentElement?.remove();
        const res = await axios.post(`${url}/api/v1/food/remove`, { id: item._id });
        if (res.data.success) {
          notyf.success(res.data.message);
        } else {
          notyf.error(res.data.message);
        }
      });
    });
  } else {
    notyf.error(response.data.message);
  }
});
