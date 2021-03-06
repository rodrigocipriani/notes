import { appApi } from "../../shared/api";

const authActionTypes = {
  LOAD_USER: "LOAD_USER",
  LOAD_GOOGLE_AUTH_URL: "LOAD_GOOGLE_AUTH_URL"
};

export const loadGoogleAuthUrl = () => {
  return {
    type: authActionTypes.LOAD_GOOGLE_AUTH_URL,
    payload: "delete this"
    // promise: appApi.get("auth/google-auth/geturl")
  };
};

export const loadUser = () => {
  return {
    type: authActionTypes.LOAD_USER,
    promise: appApi.get("/auth/user")
  };
};

export { authActionTypes };
