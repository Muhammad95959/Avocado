import type IFood from "./interfaces/IFood";
import { menu_list } from "./utils/assets";
import handleCartDot from "./utils/handleCartDot";
import axios from "axios";

const navbarMenuItems = [...document.querySelectorAll(".navbar-menu li")] as HTMLLIElement[];
const menuChoices = document.querySelector(".menu-choices") as HTMLDivElement;
const topDishesCardsContainer = document.querySelector(".top-dishes .cards") as HTMLDivElement;
const url = "http://localhost:4000";
let category = "All";
let pageRefreshed = true;

handleCartDot();

// handle navbar menu items click event
navbarMenuItems.forEach((li) => {
  li.addEventListener("click", () => {
    if (li.classList.contains("active")) {
      li.classList.remove("active");
      return;
    }
    navbarMenuItems.forEach((val) => val.classList.remove("active"));
    li.classList.add("active");
  });
});

// dynamically add menu-choices in explore menu
menu_list.forEach((val) => {
  const menuChoice = document.createElement("div");
  menuChoice.classList.add("menu-choice");
  menuChoice.dataset.menuName = val.menu_name;
  menuChoices.appendChild(menuChoice);
  const img = document.createElement("img");
  img.src = val.menu_image;
  img.tabIndex = 0;
  img.addEventListener("click", (ev) => {
    changeCategory(ev.target);
    if (menuChoice.classList.contains("active")) {
      menuChoice.classList.remove("active");
      return;
    }
    [...menuChoices.children].forEach((val) => val.classList.remove("active"));
    menuChoice.classList.add("active");
  });
  menuChoice.appendChild(img);
  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = val.menu_name;
  menuChoice.appendChild(name);
});

// dynamically add top dishes
addTopDishes();
async function addTopDishes() {
  const token = localStorage.getItem("token");
  let foodList: IFood[];
  const foodListStr = sessionStorage.getItem("foodList");
  if (!foodListStr || pageRefreshed) {
    const res1 = await axios.get(`${url}/api/v1/food/list`);
    foodList = res1.data.data as IFood[];
    sessionStorage.setItem("foodList", JSON.stringify(foodList));
    pageRefreshed = false;
    if (token) {
      const res2 = await axios.get(`${url}/api/v1/cart/get`, { headers: { token } });
      const cartData = res2.data.cartData as Record<string, string>;
      for (const id in cartData) {
        sessionStorage.setItem(`cartItemsCount-${id}`, cartData[id]);
      }
    }
  } else foodList = JSON.parse(foodListStr);
  foodList.forEach((val) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.cartItemsCount = sessionStorage.getItem(`cartItemsCount-${val._id}`) || "0";
    if (category === "All" || category === val.category) {
      topDishesCardsContainer.appendChild(card);
    } else return;
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");
    card.appendChild(imgContainer);
    const img = document.createElement("img");
    img.classList.add("dish-photo");
    img.src = `${url}/images/${val.image}`;
    imgContainer.appendChild(img);
    const addIcon = document.createElement("img");
    addIcon.classList.add("add");
    addIcon.src = "src/assets/icon_add_white.png";
    addIcon.tabIndex = 0;
    if (card.dataset.cartItemsCount !== "0") addIcon.classList.add("hidden");
    imgContainer.appendChild(addIcon);
    const cartHandler = document.createElement("div");
    cartHandler.classList.add("cart-handler");
    if (card.dataset.cartItemsCount === "0") cartHandler.classList.add("hidden");
    imgContainer.appendChild(cartHandler);
    const decIcon = document.createElement("img");
    decIcon.classList.add("dec");
    decIcon.src = "src/assets/icon_remove_red.png";
    decIcon.tabIndex = 0;
    cartHandler.appendChild(decIcon);
    const cartItemsCount = document.createElement("p");
    cartItemsCount.classList.add("cart-items-count");
    cartItemsCount.textContent = card.dataset.cartItemsCount;
    cartHandler.appendChild(cartItemsCount);
    const incIcon = document.createElement("img");
    incIcon.classList.add("inc");
    incIcon.src = "src/assets/icon_add_green.png";
    incIcon.tabIndex = 0;
    cartHandler.appendChild(incIcon);
    const info = document.createElement("div");
    info.classList.add("info");
    card.appendChild(info);
    const row = document.createElement("div");
    row.classList.add("row");
    info.appendChild(row);
    const name = document.createElement("h3");
    name.classList.add("name");
    name.textContent = val.name;
    row.appendChild(name);
    const ratingImg = document.createElement("img");
    ratingImg.src = "src/assets/rating_starts.png";
    row.appendChild(ratingImg);
    const desc = document.createElement("p");
    desc.classList.add("description");
    desc.textContent = val.description;
    info.appendChild(desc);
    const price = document.createElement("p");
    price.classList.add("price");
    info.appendChild(price);
    price.textContent = `$${val.price}`;
    addIcon.addEventListener("click", async () => {
      card.dataset.cartItemsCount = "1";
      addIcon.classList.add("hidden");
      cartHandler.classList.remove("hidden");
      cartItemsCount.textContent = "1";
      sessionStorage.setItem(`cartItemsCount-${val._id}`, "1");
      handleCartDot();
      if (token)
        await axios.post(
          `${url}/api/v1/cart/add`,
          { itemId: val._id },
          { headers: { token: localStorage.getItem("token") } },
        );
    });
    decIcon.addEventListener("click", async () => {
      if (card.dataset.cartItemsCount === "1") {
        addIcon.classList.remove("hidden");
        cartHandler.classList.add("hidden");
        cartItemsCount.textContent = "0";
        sessionStorage.removeItem(`cartItemsCount-${val._id}`);
      } else {
        card.dataset.cartItemsCount = String(parseInt(card.dataset.cartItemsCount as string) - 1);
        cartItemsCount.textContent = card.dataset.cartItemsCount;
        sessionStorage.setItem(`cartItemsCount-${val._id}`, card.dataset.cartItemsCount);
      }
      handleCartDot();
      if (token)
        await axios.post(
          `${url}/api/v1/cart/remove`,
          { itemId: val._id },
          { headers: { token: localStorage.getItem("token") } },
        );
    });
    incIcon.addEventListener("click", async () => {
      card.dataset.cartItemsCount = String(parseInt(card.dataset.cartItemsCount as string) + 1);
      cartItemsCount.textContent = card.dataset.cartItemsCount;
      sessionStorage.setItem(`cartItemsCount-${val._id}`, card.dataset.cartItemsCount);
      handleCartDot();
      if (token)
        await axios.post(
          `${url}/api/v1/cart/add`,
          { itemId: val._id },
          { headers: { token: localStorage.getItem("token") } },
        );
    });
  });
}

function changeCategory(target: EventTarget | null) {
  const item = target as HTMLDivElement;
  const menuChoice = item.parentElement;
  if (!menuChoice) throw Error("Something is wrong in the html structure");
  if (!menuChoice.classList.contains("active")) {
    category = menuChoice.dataset.menuName || "All";
  } else category = "All";
  const oldCards = [...topDishesCardsContainer.children];
  addTopDishes();
  oldCards.forEach((val) => val.remove());
}
