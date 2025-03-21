// Lab2新增

import {axios} from "../utils/request.ts";
import {STATISTIC_MODULE} from "./_prefix.ts";


export const getTable = async () => {
    return axios.post(`${STATISTIC_MODULE}/table`, {},
        {responseType: 'blob'})
        .then(res => {
            return res;
        })
        .catch(err => {

            return err.response;
        });
};


export const statisticInfo = async () => {
    return axios.get(`${STATISTIC_MODULE}/getInfo`)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};


export const statisticChartInfo = async () => {
    return axios.get(`${STATISTIC_MODULE}/lineChart`)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

