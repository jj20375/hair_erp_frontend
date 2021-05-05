import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 業績報表
 * @param { type Object(物件) } data 搜尋條件 以及必要參數
 * @example { 
 *   operator_id: 管理者id
 *   whereHasDateStart|operatorOrder|order_date: 開始時間
 *   whereHasDateEnd|operatorOrder|order_date: 結束時間
 *  }
 */
export const ReportPerformanceApi = (data) => {
    return axios.put(`${apiConfig}/report/performance`, data);
}
/**
 * 薪資報表
 * @param { type Object(物件) } data 搜尋條件 以及必要參數
 * @example { 
 *   operator_id: 管理者id
 *   whereHasDateStart|operatorOrder|order_date: 開始時間
 *   whereHasDateEnd|operatorOrder|order_date: 結束時間
 *  }
 */
export const ReportSalaryApi = (data) => {
    return axios.put(`${apiConfig}/report/salary`, data);
}
/**
 * 總額報表
 * @param { type Object(物件) } data 搜尋條件 以及必要參數
 * @example { 
 *   operator_id: 管理者id
 *   customStartDate|order_date: 開始時間
 *   customEndDate|order_date: 結束時間
 *  }
 */
export const ReportTotalApi = (data) => {
    return axios.put(`${apiConfig}/report/total`, data);
}
/**
 * 總額報表
 * @param { type Object(物件) } data 搜尋條件 以及必要參數
 * @example { 
 *   operator_id: 管理者id
 *   customStartDate|order_date: 開始時間
 *   customEndDate|order_date: 結束時間
 *  }
 */
export const ReportPurchaseApi = (data) => {
    return axios.put(`${apiConfig}/report/purchase`, data);
}