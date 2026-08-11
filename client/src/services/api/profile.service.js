import api from "./api";

export const searchProfiles = async (query) => {
    const response = await api.get(
        `/users/search?query=${encodeURIComponent(query)}`
    );

    return response.data;
};

export const getPublicProfile = async (username) => {
    const response = await api.get(
        `/users/profile/${username}`
    );

    return response.data;
};