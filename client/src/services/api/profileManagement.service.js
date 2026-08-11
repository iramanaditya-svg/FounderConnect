import api from "./api";

export const switchRole = async (
    role
) => {
    const response =
        await api.post(
            "/users/select-role",
            {
                role,
            }
        );

    return response.data;
};

export const updateProfilePicture =
    async (profilePicture) => {
        const response =
            await api.patch(
                "/users/profile-picture",
                {
                    profilePicture,
                }
            );

        return response.data;
    };

export const deleteAccount =
    async () => {
        const response =
            await api.delete(
                "/users/account"
            );

        return response.data;
    };