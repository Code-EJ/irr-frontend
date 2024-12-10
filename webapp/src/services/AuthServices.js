import axios from "axios";
import { API_HOST } from "../config/consts";
import { errorToast } from "./ToastServices";

export const handleAuth = (username, password) => {
  axios
    .post(`${API_HOST}/login`, { username, password })
    .then((res) => res.data)
    .catch((err) => errorToast(err));
};
