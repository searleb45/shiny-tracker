import { combineReducers } from "redux";
import huntsReducer from "./reducers/hunts";
import userReducer from "./reducers/user";
import shinyDexReducer from "./reducers/shinydex";

export default combineReducers({
	user: userReducer,
	hunts: huntsReducer,
	shinyDex: shinyDexReducer,
	serviceWorkerEnabled: (state) => state || false
});