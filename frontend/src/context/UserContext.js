import { createContext } from "react";

const defaultUserContext = {
	user: null,
	token: null,
	login: () => {},
	logout: () => {}
};

export const UserContext = createContext(defaultUserContext);