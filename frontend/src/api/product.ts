// Lab2新增

import {axios} from "../utils/request.ts";
import {PRODUCT_MODULE} from "./_prefix.ts";

export type ProductInfo = {
    productId: number,
    productName: string,
    productType: string,
    imgURLs: string[],
    description: string,
    storeId: number,
    price: string,
    createTime: string,
    number: number,
    grade: string,
    productComments: Comment[]
}

export type ProductUploadInfo = {
    productName: string,
    productType: string,
    imgURLs: string[],
    description: string
    storeId: number
    price: number
    number: number
}

export type ProductNumUpdateInfo = {
    productId: number,
    number: number
}

export type Comment = {
    orderSerialNumber: string,
    createTime: string,
    grade: number,
    userName: string,
    productId: number,
    content: string
}

export type ProductSearchInfo = {
    upperBound?: number;
    lowerBound?: number;
    name: string;
    storeId?: number;
    type?: string;
    [property: string]: any;
}

export const uploadProductInfo = async (payload: ProductUploadInfo) => {
    return axios.post(`${PRODUCT_MODULE}/create`, payload,)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

export const productInfoDetail = async (productId: number) => {
    return axios.get(`${PRODUCT_MODULE}/getProductDetail`, {params: {productId: productId}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadProductNumUpdate = async (payload: ProductNumUpdateInfo) => {
    return axios.post(`${PRODUCT_MODULE}`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

export const searchProduct = async (payload: ProductSearchInfo, page: number, size: number) => {
    return axios.get(`${PRODUCT_MODULE}/select`, {
        params: {
            name: payload.name,
            upperBound: payload.upperBound,
            lowerBound: payload.lowerBound,
            storeId: null,
            type: payload.type,
            page: page,
            size: size
        }
    })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};