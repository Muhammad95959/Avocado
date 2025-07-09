import "notyf/notyf.min.css";
import { Notyf } from "notyf";

const mobile = document.querySelector("a.mobile") as HTMLAnchorElement;
if (mobile)
  mobile.addEventListener("click", () => {
    new Notyf({ duration: 3000 }).error("Mobile app not available at the moment.");
  });
