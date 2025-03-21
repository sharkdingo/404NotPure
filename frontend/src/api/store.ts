import {axios} from '../utils/request';
import {STORE_MODULE} from './_prefix';
import {ProductInfo} from "./product.ts";

// 用于全部商店展示，即商店列表
export type StoreInfo = {
    address: string,
    storeName: string,
    imgURL: string,
    description: string
}

export type StoresInfo = {
    storeId: number,
    storeName: string,
    address: string,
    createTime: string,
    imgURL: string,
    description: string
}[]


// 用于单个商店展示
export interface StoreInfoDetail {
    address: string;
    createTime: string;
    description: string;
    imgURL: string;
    products: ProductInfo[];
    storeId: number;
    storeName: string;
    grade: string;

    [property: string]: any;
}

export const uploadStoreInfo = async (payload: StoreInfo) => {
    return axios.post(`${STORE_MODULE}/create`, payload,)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

// 获取商店列表
export const storesPageInfo = async (page: number, size: number) => {
    return axios.get(`${STORE_MODULE}`, {params: {page: page, size: size}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const storeInfoDetail = async (storeId: number) => {
    return axios.get(`${STORE_MODULE}/getStoreDetail`, {params: {storeId: storeId}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};
