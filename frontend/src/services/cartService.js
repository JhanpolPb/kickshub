import api from "./api";

export const getCart = async () => {
    const res = await api.get("/cart");
    return res.data;
}