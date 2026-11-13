import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right',
        autoClose: 2000,
        theme: 'colored'
    })
}

export const handleError = (msg) => {

    let errorMessage = "Something went wrong";

    if (typeof msg === "string") {
        errorMessage = msg;
    } else if (msg?.response?.data?.message) {
        errorMessage = msg.response.data.message;
    } else if (msg?.message) {
        errorMessage = msg.message;
    }

    toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
    });
}
export function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function isLoggedIn() {
    return !!localStorage.getItem("token");
}

export function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}