import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得薪水列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 員工名稱 type String(字串)
 * account: 員工帳號 type String(字串)
 * pay: 員工薪資 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["salary_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const SalaryListApi = (data) => {
    return axios.post(`${apiConfig}/salary/lists`, data);
};
/**
 * 取得指定id薪水列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 員工名稱 type String(字串)
 * account: 員工帳號 type String(字串)
 * pay: 員工薪資 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["salary_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const SalaryListByIdApi = (data) => {
    return axios.post(`${apiConfig}/salary/listsById`, data);
};
/**
 * 新增薪水
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   ableType: type String(字串) 新增員工身份 (assistant = 助理 subAccount = 其他身份員工)
 *   account: type String(字串) 員工帳號(助理帳號 或 子帳號帳號)
 *   pay: type Number(數字) 薪水
 * }
 */
 export const AddSalaryApi = (data) => {
    return axios.put(`${apiConfig}/salary/create`, data);
};
/**
 * 更新薪水
 * @param { type Object(物件) } data
 * @example {
 *   salary_id: type String or Number(字串或數字) 薪水id
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   ableType: type String(字串) 新增員工身份 (assistant = 助理 subAccount = 其他身份員工)
 *   account: type String(字串) 員工帳號(助理帳號 或 子帳號帳號)
 *   pay: type Number(數字) 薪水
 * }
 */
 export const UpdateSalaryApi = (data) => {
    return axios.put(`${apiConfig}/salary/update`, data);
};
/**
 * 取得單一薪水資料
 * @param { type String (字串) } account 員工帳號
 */
 export const SalaryDataApi = (account) => {
    return axios.post(`${apiConfig}/salary/getData`, { account });
};