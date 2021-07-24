import { combineReducers } from "redux";
import huntsReducer from "./reducers/hunts";
import userReducer from "./reducers/user";

export default combineReducers({
	user: userReducer,
	hunts: huntsReducer
});