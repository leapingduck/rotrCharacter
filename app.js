import { pageLoad } from "./dom.js";
import { calculateMacro } from "./macro.js";
import { handleStateChange } from "./stateEngine.js";

pageLoad();
handleStateChange();
calculateMacro();
