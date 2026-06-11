 const setToken = (token) => {
    localStorage.setItem("accessToken", token);
}

 const getToken = () => {
    return localStorage.getItem("accessToken");
}

 const removeToken = () => {
    localStorage.removeItem("accessToken");
}

export {setToken, getToken, removeToken};