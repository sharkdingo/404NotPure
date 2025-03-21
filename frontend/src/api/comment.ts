import {axios} from "../utils/request.ts";
import {COMMENT_MODULE} from "./_prefix.ts";


export type commentInfo = {
    content: string;
    grade: number;
    orderSerialNumber: string;
    productId: number;
    [property: string]: any;
}

export const uploadComment = async (payload: commentInfo) => {
    return axios.post(`${COMMENT_MODULE}`, payload,)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};