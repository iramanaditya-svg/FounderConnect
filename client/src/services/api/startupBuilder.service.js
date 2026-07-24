import api from "./api";

export const createStartupBuilderProfile = async (profileData) => {
    const response = await api.post(
        "/startup-builder/profile",
        profileData
    );

    return response.data;
};

export const getStartupBuilderProfile = async () => {
    const response = await api.get(
        "/startup-builder/profile"
    );

    return response.data;
};

export const updateStartupBuilderProfile = async (profileData) => {
    const response = await api.put(
        "/startup-builder/profile",
        profileData
    );

    return response.data;
};

export const deleteStartupBuilderProfile = async () => {
    const response = await api.delete(
        "/startup-builder/profile"
    );

    return response.data;
};