import axios from "axios";

interface IGetAddress {
    page: number;
    size: number;
    sort: string;
    filter: string;
    search: string;
    all: boolean;
}
export const getProvince = async ({
    page = 0,
    size = 63,
    sort = "id,desc",
    filter = "",
    search = "",
    all,
}: IGetAddress) => {
    try {
        const response = await axios.get(
            "http://localhost:8080/api/provinces",
            {
                params: {
                    page,
                    size,
                    sort,
                    filter,
                    search,
                    all,
                },
            },
        );

        return response.data.content;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

export const getDistrict = async ({
    page = 0,
    size = 63,
    sort = "id,desc",
    filter = "",
    search = "",
    all,
}: IGetAddress) => {
    try {
        const response = await axios.get(
            "http://localhost:8080/api/districts",
            {
                params: {
                    page,
                    size,
                    sort,
                    filter,
                    search,
                    all,
                },
            },
        );

        return response.data.content;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

export const getWard = async ({
    page = 0,
    size = 63,
    sort = "id,desc",
    filter = "",
    search = "",
    all,
}: IGetAddress) => {
    try {
        const response = await axios.get("http://localhost:8080/api/wards", {
            params: {
                page,
                size,
                sort,
                filter,
                search,
                all,
            },
        });

        return response.data.content;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};
