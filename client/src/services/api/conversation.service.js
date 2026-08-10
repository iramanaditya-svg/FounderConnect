import api from "./api";

export const getConversations = async () => {
    const response =
        await api.get(
            "/conversations"
        );

    return response.data;
};

export const searchChatUsers = async (
    query
) => {
    const response =
        await api.get(
            `/conversations/search?q=${encodeURIComponent(query)}`
        );

    return response.data;
};

export const createConversation =
    async (userId) => {
        const response =
            await api.post(
                "/conversations",
                {
                    userId,
                }
            );

        return response.data;
    };

export const getMessages =
    async (conversationId) => {
        const response =
            await api.get(
                `/conversations/${conversationId}/messages`
            );

        return response.data;
    };