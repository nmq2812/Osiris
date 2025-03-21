import axios from "axios";
export const getProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/products");
    return await res.data.content;
};
