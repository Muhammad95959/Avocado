import axios from "axios";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const addItemsForm = document.querySelector("form.add-items-form") as HTMLFormElement;
const uploadImage = document.querySelector(".add-items-form .upload img") as HTMLImageElement;
const uploadInput = document.querySelector(".add-items-form .upload input") as HTMLInputElement;
const nameInput = document.querySelector(".add-items-form .name input") as HTMLInputElement;
const descTextarea = document.querySelector(".add-items-form .description textarea") as HTMLTextAreaElement;
const categorySelect = document.querySelector(".add-items-form .category select") as HTMLSelectElement;
const priceInput = document.querySelector(".add-items-form .price input") as HTMLInputElement;

uploadInput.addEventListener("change", (e) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    const file = input.files[0];
    uploadImage.src = URL.createObjectURL(file);
  }
});

addItemsForm.addEventListener("submit", async (e) => {
  const url = "http://localhost:4000";
  const imageFile = uploadInput.files?.[0];
  if (!imageFile) return console.log("No file selected");
  const name = nameInput.value;
  const description = descTextarea.value;
  const category = categorySelect.value;
  const price = priceInput.value;
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("name", name);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("price", price);
  const response = await axios.post(`${url}/api/v1/food/add`, formData);
  console.log(response);
  const notyf = new Notyf();
  if (response.data.success) {
    resetForm();
    notyf.success(response.data.message);
  } else {
    notyf.error(response.data.message);
  }
});

function resetForm() {
  uploadImage.src = "src/assets/upload_area.png";
  uploadInput.value = "";
  nameInput.value = "";
  descTextarea.value = "";
  priceInput.value = "";
}
