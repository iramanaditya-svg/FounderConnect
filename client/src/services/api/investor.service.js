import api from "./api";

export const createInvestorProfile = async (
    profileData
) => {
    const response = await api.post(
        "/investor/profile",
        profileData
    );

    return response.data;
};

export const getInvestorProfile = async () => {
    const response = await api.get(
        "/investor/profile"
    );

    return response.data;
};

export const updateInvestorProfile = async (
    profileData
) => {
    const response = await api.put(
        "/investor/profile",
        profileData
    );

    return response.data;
};

export const deleteInvestorProfile = async () => {
    const response = await api.delete(
        "/investor/profile"
    );

    return response.data;
};

export const getMyInvestments = async () => {
    const response = await api.get(
        "/investments/my"
    );

    return response.data;
};

export const createInvestmentRequest = async (
    startupId,
    investmentData
) => {
    const response = await api.post(
        `/startups/${startupId}/investments`,
        investmentData
    );

    return response.data;
};