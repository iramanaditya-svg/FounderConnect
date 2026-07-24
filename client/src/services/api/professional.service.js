import api from "./api";

export const createProfessionalProfile = async (profileData) => {
    const response = await api.post(
        "/professional/profile",
        profileData
    );

    return response.data;
};

export const getProfessionalProfile = async () => {
    const response = await api.get(
        "/professionals/profile"
    );

    return response.data;
};

export const updateProfessionalProfile = async (profileData) => {
    const response = await api.patch(
        "/professionals/profile",
        profileData
    );

    return response.data;
};

export const deleteProfessionalProfile = async () => {
    const response = await api.delete(
        "/professionals/profile"
    );

    return response.data;
};