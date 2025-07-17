import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";
import type IFood from "./interfaces/IFood";

const loginPopup = document.querySelector(".login-popup") as HTMLDivElement;
const loginCloseBtns = [...document.querySelectorAll(".login-popup .close-btn")] as HTMLImageElement[];
const loginPopupSubmitBtns = [...document.querySelectorAll(".login-popup input[type='submit']")] as HTMLInputElement[];
const changeLoginPopupStateBtns = [...document.querySelectorAll(".login-popup .change span")] as HTMLSpanElement[];
const loginForm = document.querySelector(".login-popup .login-form") as HTMLFormElement;
const signInBtn = document.querySelector(".navbar .sign-in-btn") as HTMLButtonElement;
const signupForm = document.querySelector(".login-popup .signup-form") as HTMLFormElement;
const loginBtn = document.querySelector('.login-form input[type="submit"]') as HTMLInputElement;
const signupBtn = document.querySelector('.signup-form input[type="submit"]') as HTMLInputElement;
const userIcon = document.querySelector(".navbar .user-icon") as HTMLDivElement;
const userIconPopup = document.querySelector(".navbar .user-icon .popup") as HTMLDivElement;
const logoutBtn = document.querySelector(".navbar .user-icon .logout") as HTMLDivElement;
const url = "https://avocado-production-778f.up.railway.app";
const notyf = new Notyf({ duration: 3000 });

signInBtn.addEventListener("click", () => loginPopup.classList.remove("hidden"));
loginPopupSubmitBtns.forEach((val) => val.addEventListener("click", () => loginPopup.classList.remove("hidden")));
loginCloseBtns.forEach((val) => val.addEventListener("click", () => loginPopup.classList.add("hidden")));
changeLoginPopupStateBtns.forEach((val) =>
  val.addEventListener("click", () => {
    loginForm.classList.toggle("hidden");
    signupForm.classList.toggle("hidden");
  }),
);

userIcon.addEventListener("click", () => {
  userIconPopup.classList.toggle("hidden");
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  handleUserIcon();
});

loginBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!loginForm.reportValidity()) return;
  const emailInput = document.querySelector('.login-form .inputs input[name="email"]') as HTMLInputElement;
  const email = emailInput.value;
  const passwordInput = document.querySelector('.login-form .inputs input[name="password"]') as HTMLInputElement;
  const password = passwordInput.value;
  try {
    const response = await axios.post(`${url}/api/v1/users/login`, { email, password });
    if (response.data.success) {
      notyf.success("Logged in successfully");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.name);
      emailInput.value = "";
      passwordInput.value = "";
      loginPopup.classList.add("hidden");
      userIconPopup.classList.add("hidden");
      handleUserIcon();
      uploadCartDataToDatabase();
    } else notyf.error(response.data.message);
  } catch (error) {
    console.log(error);
  }
});

signupBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!signupForm.reportValidity()) return;
  const nameInput = document.querySelector('.signup-form .inputs input[name="name"]') as HTMLInputElement;
  const name = nameInput.value;
  const emailInput = document.querySelector('.signup-form .inputs input[name="email"]') as HTMLInputElement;
  const email = emailInput.value;
  const passwordInput = document.querySelector('.signup-form .inputs input[name="password"]') as HTMLInputElement;
  const password = passwordInput.value;
  try {
    const response = await axios.post(`${url}/api/v1/users/register`, { name, email, password });
    if (response.data.success) {
      notyf.success("The user is created successfully");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.name);
      nameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      loginPopup.classList.add("hidden");
      userIconPopup.classList.add("hidden");
      handleUserIcon();
      uploadCartDataToDatabase();
    } else notyf.error(response.data.message);
  } catch (error) {
    console.log(error);
  }
});

handleUserIcon();
function handleUserIcon() {
  if (localStorage.getItem("token")) {
    signInBtn.style.display = "none";
    userIcon.style.display = "initial";
    (userIcon.querySelector(".welcome") as HTMLParagraphElement).textContent =
      `Welcome ${localStorage.getItem("username")}`;
  } else {
    signInBtn.style.display = "initial";
    userIcon.style.display = "none";
  }
}

async function uploadCartDataToDatabase() {
  const response = await axios.get(`${url}/api/v1/food/list`);
  if (response.data.success) {
    const cartData: Record<string, string> = {};
    const foodList = response.data.data as IFood[];
    foodList.forEach((food) => {
      const itemCount = sessionStorage.getItem(`cartItemsCount-${food._id}`);
      if (itemCount) {
        cartData[food._id] = itemCount;
      }
    });
    const token = localStorage.getItem("token");
    const res = await axios.patch(`${url}/api/v1/cart/update`, { cartData }, { headers: { token } });
    if (!res.data.success) notyf.error(response.data.message);
  } else {
    notyf.error(response.data.message);
  }
}
