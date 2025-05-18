import { menu_list } from "./utils/assets";

const navbarMenuItems = Array.from(
  document.querySelectorAll(".navbar-menu li") as NodeListOf<HTMLLIElement>,
);
const menuChoices = document.querySelector(".menu-choices") as HTMLDivElement;

// handle navbar menu items click event
navbarMenuItems.forEach((li) => {
  li.addEventListener("click", () => {
    navbarMenuItems.forEach((val) => val.classList.remove("active"));
    li.classList.add("active");
  });
});

// dynamically add menu-choices in explore menu
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
