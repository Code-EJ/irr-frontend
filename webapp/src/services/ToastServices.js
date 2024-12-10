import { toast } from "react-toastify";

// Success Toast
export const successToast = (message) => {
  toast.success(message);
};

// Error Toast
export const errorToast = (message) => {
  toast.error(message);
};

// Info Toast
export const infoToast = (message) => {
  toast.info(message);
};

// Warning Toast
export const warningToast = (message) => {
  toast.warning(message);
};
