import { toast } from "react-toastify"

const successToast = (message) => {
    toast.success(message);
}

const errorToast = (message) => {
    toast.error(message);
}

export { successToast, errorToast };