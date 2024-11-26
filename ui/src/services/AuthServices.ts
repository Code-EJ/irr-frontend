import axios from "axios";
import { API_HOST } from "../config/consts";

export const auth = () => {
  axios
    .get(`${API_HOST}/login`)
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));
};
