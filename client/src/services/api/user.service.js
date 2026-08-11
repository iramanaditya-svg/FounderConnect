import api from "./api";

export const changeCurrentPassword = async (
    currentPassword,
    newPassword,
    confirmPassword
) => {
    return api.post("/users/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
    });
};