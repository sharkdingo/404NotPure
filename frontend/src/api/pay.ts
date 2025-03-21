// import {axios} from "../utils/request.ts";
// import {PAY_MODULE} from "./_prefix.ts";

export interface ProductsPassInfo {
    products: ProductPassInfo[];
}

export interface ProductPassInfo {
    productId: number;
    num: number;
    storeId: number;
}

export interface ProductPayInfo {
    productId: number;
    num: number;
}

export interface StorePayInfo {
    storeId: number;
    products: ProductPayInfo[];
    couponId: number;
}

export interface PayInfo {
    stores: StorePayInfo[];
    couponId: number;
    method: "DELIVERY" | "PICKUP";
}

// display
export interface ProductDisplayInfo {
    productId: number;
    productName: string;
    productNum: number;
    before: number;
    after: number;
}

export interface StoreDisplayInfo {
    storeId: number;
    storeName: string;
    products: ProductDisplayInfo[];
    coupons: any[];
    bestCoupon: number;
}

export interface PayDisplayInfo {
    stores: StoreDisplayInfo[];
    method: "DELIVERY" | "PICKUP";
    coupons: any[];
    bestCoupon: number;
    totalBefore: number;
    totalAfter: number;
}
