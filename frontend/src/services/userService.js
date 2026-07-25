import  api from  "./api";

export const getProfile = async () =>{
    const res = await api.get("/users");
    return res.data;
}


export const updateProfile = async (name,email) => {
    const res = await api.put("/users/profile", {name,email});
    return res.data;

}

export const changePassword = async (currentPassword, newPassword) => {
  const res = await api.put("/users/change-password", { currentPassword, newPassword });
  return res.data;
};