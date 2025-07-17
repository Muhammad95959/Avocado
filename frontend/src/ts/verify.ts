import axios from "axios";

const url = "https://avocado-production-778f.up.railway.app";
const success = new URLSearchParams(window.location.search).get("success");
const orderId = new URLSearchParams(window.location.search).get("orderId");
const token = localStorage.getItem("token");

const response = await axios.post(`${url}/api/v1/order/verify`, { success, orderId }, { headers: { token } });

if (response.data.success) {
  sessionStorage.clear();
  window.location.replace("myorders.html");
} else window.location.replace("index.html");
