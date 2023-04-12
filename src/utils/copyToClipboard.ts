import customToast from "@/components/Notification";

const copyToClipboard = async (message: string, withToast = false, toastMessage = "") => {
    navigator.clipboard.writeText(message);
    withToast && customToast({ message: toastMessage });
}

export default copyToClipboard;