import { menu_list } from "./utils/assets";

const menuChoices = document.querySelector(".menu-choices") as HTMLDivElement;
menu_list.forEach((val) => {
  const menuChoice = document.createElement("div");
  menuChoice.classList.add("menu-choice");
  menuChoices.appendChild(menuChoice);
  const img = document.createElement("img");
  img.src = val.menu_image;
  menuChoice.appendChild(img);
  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = val.menu_name;
  menuChoice.appendChild(name);
});
