import {axios} from "../utils/request.ts";
import {CART_MODULE} from "./_prefix.ts";


export const add2ShoppingCart = async (id: number) => {
    return axios.post(`${CART_MODULE}/add`, {}, {params: {productId: id}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const getShoppingCart = async () => {
    return axios.get(`${CART_MODULE}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const removeCartItem = async (id: number) => {
    return axios.delete(`${CART_MODULE}`, {params: {productId: id}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

