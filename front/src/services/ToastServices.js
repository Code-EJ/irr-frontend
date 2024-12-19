import { toast } from "react-toastify";

// Pacotes de Toast
export const successToast = (message) => {
  toast.success(message);
};

export const errorToast = (message) => {
  toast.error(message);
};

export const infoToast = (message) => {
  toast.info(message);
};

export const warningToast = (message) => {
  toast.warning(message);
};
