const loginPopup = document.querySelector(".login-popup") as HTMLDivElement;
const loginCloseBtns = [
  ...document.querySelectorAll(".login-popup .close-btn"),
] as HTMLImageElement[];
const loginPopupSubmitBtns = [
  ...document.querySelectorAll(".login-popup input[type='submit']"),
] as HTMLInputElement[];
const changeLoginPopupStateBtns = [
  ...document.querySelectorAll(".login-popup .change span"),
] as HTMLSpanElement[];
const loginForm = document.querySelector(".login-popup .login-form") as HTMLFormElement;
const signInBtn = document.querySelector(".navbar .sign-in-btn") as HTMLButtonElement;
const signupForm = document.querySelector(".login-popup .signup-form") as HTMLFormElement;

// handle login popup
signInBtn.addEventListener("click", () => loginPopup.classList.remove("hidden"));
loginPopupSubmitBtns.forEach((val) =>
  val.addEventListener("click", () => loginPopup.classList.remove("hidden")),
);
loginCloseBtns.forEach((val) =>
  val.addEventListener("click", () => loginPopup.classList.add("hidden")),
);
changeLoginPopupStateBtns.forEach((val) =>
  val.addEventListener("click", () => {
    loginForm.classList.toggle("hidden");
    signupForm.classList.toggle("hidden");
  }),
);
