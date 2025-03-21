import {axios} from "../utils/request.ts";
import {COUPON_MODULE} from "./_prefix.ts";
import {PayInfo, ProductsPassInfo} from "./pay.ts";


export type CouponUploadInfo = {
    couponType: string;
    effectiveTime: string;
    expiredTime: string;
    full: number;
    reduction: number;
    storeId: number;
    [property: string]: any;
}

export const uploadCouponInfo = async (payload: CouponUploadInfo, num: number) => {
    return axios.post(`${COUPON_MODULE}/publish`, payload, {params: {couponNum: num}})
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

export const userCouponsInfo = async (page: number) => {
    return axios.get(`${COUPON_MODULE}/received`, {params: {page: page}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const couponsInfo = async (page: number) => {
    return axios.get(`${COUPON_MODULE}`, {params: {page: page}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadReceiveCouponsInfo = async (id: number) => {
    return axios.get(`${COUPON_MODULE}/receive`, {params: {couponGroupId: id}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const userStoreCouponsInfo = async (page: number, size: number, storeId: number) => {
    return axios.get(`${COUPON_MODULE}/shop`, {params: {page: page, storeId: storeId, size: size}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const storeCouponNumInfo = async (storeId: number) => {
    return axios.get(`${COUPON_MODULE}/shop/number`, {params: {storeId: storeId}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const payDisplayInfo = async (payload: PayInfo) => {
    return axios.post(`${COUPON_MODULE}/pay`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const getBestInfo = async (payload: PayInfo) => {
    return axios.post(`${COUPON_MODULE}/bestInfo`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const getBestPrice = async (payload: ProductsPassInfo) => {
    return axios.post(`${COUPON_MODULE}/best`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};
