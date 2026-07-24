import api from "./axios";

export const completeProfessionalProfile = (data) => {
    return api.post("/professionals/complete-profile", data);
};