import { handleStateChange } from "./stateEngine.js";

export const stateCheckboxes =
  document.getElementsByClassName("state-checkbox");

export const domRef = {
  output: document.getElementById("output"),
  summaryFirst: document.getElementById("summaryFirst"),
};

Array.from(stateCheckboxes).forEach((c) =>
  c.addEventListener("change", handleStateChange)
);
