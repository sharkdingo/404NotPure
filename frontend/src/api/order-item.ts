import {axios} from "../utils/request.ts";
import {ORDER_MODULE} from "./_prefix.ts";

export type OrderItemInfo = {
    orderSerialNumber: string
    deliverSerialNumber: string
    total: string
    totalAfter: string
    productId: number
    productName: string
    productNumber: number
    productPrice: string
    imgURL: string
    createTime: string,
    storeId: number
    userPhone: string
    method: string
    state: string
    address: string
    bind?: boolean
}

export type OrderItemsInfo = OrderItemInfo[];


export const orderItemPageInfo = async (page: number, size: number) => {
    return axios.get(`${ORDER_MODULE}/orderItems`, {params: {page: page, size: size}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const orderItemSend = async (orderSerialNumber: string) => {
    return axios.get(`${ORDER_MODULE}/orderItems/send`, {params: {orderSerialNumber: orderSerialNumber}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const orderItemGet = async (orderSerialNumber: string) => {
    return axios.get(`${ORDER_MODULE}/orderItems/get`, {params: {orderSerialNumber: orderSerialNumber}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

