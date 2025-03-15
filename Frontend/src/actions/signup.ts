import axios from "axios";

interface SignupCredentials {
    username: string;
    password: string;
    email: string;
    phone: string;
    fullname: string;
    gender: string;
    address: {
        line: string;
        provinceId: number;
        districtId: number;
        wardId: number;
    };
    avatar: string;
    status: number;
    roles: {
        id: number;
        code: string;
        name: string;
        status: number;
    }[];
}

export const handleSignup = (credentials: SignupCredentials) => async () => {
    try {
        const response = await axios.post(
            "http://localhost:8080/api/auth/registration",
            {
                username: credentials.username,
                password: credentials.password,
                email: credentials.email,
                phone: credentials.phone,
                fullname: credentials.fullname,
                gender: credentials.gender,
                address: {
                    line: credentials.address.line,
                    provinceId: credentials.address.provinceId,
                    districtId: credentials.address.districtId,
                    wardId: credentials.address.wardId,
                },
                avatar: credentials.avatar,
                status: credentials.status,
                roles: credentials.roles,
            },
            {
                withCredentials: true,
            },
        );

        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

export const handleVerifyEmail =
    (userId: number, token: string) => async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/auth/registration/confirm`,
                {
                    userId,
                    token,
                },
                {
                    withCredentials: true,
                },
            );

            return await response.data.content;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    };
