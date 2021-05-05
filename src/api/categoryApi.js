import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得分類列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 分類名稱 type String(字串)
 * key: 分類代碼 type String(字串)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * active: 啟用狀態 type String or Number(字串或數字)
 * sort: ["category_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const CategoryListApi = (data) => {
    return axios.post(`${apiConfig}/category/lists`, data);
};
/**
 * 取得可選擇分類列表
 * @param { type String(字串) } categoryType 分類類別
 * @param { type Number or String(數字或字串) } operatorId 管理者id
 */
 export const CategorySelectListApi = (categoryType, operatorId) => {
    return axios.post(`${apiConfig}/category/selectLists`, { categoryType, operatorId });
}
/**
 * 新增分類
 * @param { type Object(物件) } data
 * @example {
 *   name: type String(字串) 分類名稱
 *   key: type String(字串) 分類代碼
 *   active: type Boolean(布林格式) 判斷是否啟用此分類
 *   operator_ids: type Array(陣列) 可使用此分類的管理者id
 *   permission_rule: type String(字串) 數位權限值 1=設計師 2=管理者
 * }
 */
 export const AddCategoryApi = (data) => {
    return axios.put(`${apiConfig}/category/create`, data);
};
/**
 * 更新分類
 * @param { type Object(物件) } data
 * @example {
 *   category_id type Number or String(數字或字串) 分類id
 *   name: type String(字串) 分類名稱 (非必要值)
 *   key: type String(字串) 分類代碼 (非必要值)
 *   active: type Boolean(布林格式) 判斷是否啟用此分類 (非必要值)
 *   operator_ids: type Array(陣列) 可使用此分類的管理者id (非必要值)
 *   permission_rule: type String(字串) 數位權限值 1=設計師 2=管理者 (非必要值)
 * }
 */
 export const UpdateCategoryApi = (data) => {
    return axios.put(`${apiConfig}/category/update`, data);
};
/**
 * 取得單一分類資料
 * @param { type String or Number(字串或數字) } categoryId 分類id
 */
 export const CategoryDataApi = (categoryId) => {
    return axios.post(`${apiConfig}/category/getData`, { categoryId });
};