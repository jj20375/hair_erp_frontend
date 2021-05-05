import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得點數訂單列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * point: 點數訂單名稱 type Number or String(數字或字串)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["point_order_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const PointOrderListApi = (data) => {
    return axios.post(`${apiConfig}/pointOrder/lists`, data);
};
/**
 * 取得點數訂單列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * point: 點數訂單名稱 type Number or String(數字或字串)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["point_order_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const PointOrderListByIdApi = (data) => {
    return axios.post(`${apiConfig}/pointOrder/listsById`, data);
};