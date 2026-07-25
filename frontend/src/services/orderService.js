import api from "./api"

export const getOrders = async () => {
    const res = await api.get("/orders");
    return res.data;
}
export const getOrderById = async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
}
export const createOrder = async () => {
    const res = await api.post("/orders");
    return res.data;
}
