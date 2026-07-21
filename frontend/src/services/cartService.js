import api from "./api";

export const getCart = async () => {
    const res = await api.get("/cart");
    return res.data;
}

export const addToCart = async (id_product, quantity = 1) => {
  const res = await api.post("/cart", { id_product, quantity });
  return res.data;
};

export const updateCartItem = async (id, quantity) => {
    const res = await api.put (`/cart/${id}`, {quantity});
    return res.data;
}

export const  removeFromCart = async (id) => {
    const res = await api.delete (`/cart/${id}`);
    return res.data;
}

export const clearCart = async () => {
    const res = await api.delete("/cart");
    return res.data;
}