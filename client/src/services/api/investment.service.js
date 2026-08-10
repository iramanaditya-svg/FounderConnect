import api from "./api";

export const getStartupInvestmentRequests = async (
    startupId
) => {
    const response = await api.get(
        `/startups/${startupId}/investments`
    );

    return response.data;
};

export const updateInvestmentStatus = async (
    investmentId,
    status
) => {
    const response = await api.patch(
        `/investments/${investmentId}/status`,
        {
            status,
        }
    );

    return response.data;
};