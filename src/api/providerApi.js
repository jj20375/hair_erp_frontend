import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得廠商列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 廠商名稱 type String(字串)
 * key: 廠商代碼 type String(字串)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["provider_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const ProviderListApi = (data) => {
    return axios.post(`${apiConfig}/provider/lists`, data);
};
/**
 * 取得廠商列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 廠商名稱 type String(字串)
 * key: 廠商代碼 type String(字串)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["provider_id|DESC"] 排序 type Array(陣列) 
 * operatorId: 管理者id type Number or String(數字或字串)
 * }
 */
 export const ProviderListByIdApi = (data) => {
    return axios.post(`${apiConfig}/provider/listsById`, data);
};
/**
 * 取得可選擇廠商列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const ProviderSelectListApi = (operatorId) => {
    return axios.post(`${apiConfig}/provider/selectLists`, { operatorId });
}
/**
 * 新增廠商
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   name: type String(字串) 廠商名稱
 *   key: type String(字串) 廠商代碼
 *   status: type Number or String(字串或數字) 廠商狀態
 *   operator_ids: type Array(陣列) 可使用此廠商的管理者id
 *   note: type String(字串) 廠商詳情
 * }
 */
 export const AddProviderApi = (data) => {
    return axios.post(`${apiConfig}/provider/create`, data);
};
/**
 * 更新廠商
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   provider_id type Number or String(數字或字串) 廠商id
 *   name: type String(字串) 廠商名稱 (非必要值)
 *   key: type String(字串) 廠商代碼 (非必要值)
 *   status: type Number or String(字串或數字) 廠商狀態 (非必要值)
 *   operator_ids: type Array(陣列) 可使用此廠商的管理者id (非必要值)
 *   note: type String(字串) 廠商詳情 (非必要值)
 * }
 */
 export const UpdateProviderApi = (data) => {
    return axios.post(`${apiConfig}/provider/update`, data);
};
/**
 * 取得單一廠商資料
 * @param { type String or Number(字串或數字) } providerId 廠商id
 */
 export const ProviderDataApi = (providerId) => {
    return axios.post(`${apiConfig}/provider/getData`, { providerId });
};
/**
 * 刪除廠商圖片
 * @param { type String } imgPath 圖片路徑
 * @param { type String or Number (字串或數字) } providerId 廠商id
 * @returns
 */
 export const DeleteProviderImageApi = (imgPath, providerId) => {
    return axios.delete(`${apiConfig}/provider/deleteImage`, {
        data: { imgPath, providerId },
    });
};