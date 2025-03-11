import axios from "axios";

interface IGetProvince {
    page: number;
    size: number;
    sort: string;
    filter: string;
    search: string;
    all: boolean;
}
export const getProvince = async ({
    page = 0,
    size = 10,
    sort = "id,desc",
    filter = "",
    search = "",
    all,
}: IGetProvince) => {
    try {
        const response = await axios.get(
            "https://api.rajaongkir.com/starter/province",
            {
                params: {},
            },
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};
