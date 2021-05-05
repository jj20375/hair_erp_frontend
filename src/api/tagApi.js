import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得標籤列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 群組名稱 type String(字串)
 * key: 群組代碼 type String(字串)
 * active: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["tag_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const TagListApi = (data) => {
    return axios.post(`${apiConfig}/tag/lists`, data);
};
/**
 * 取得可選擇標籤列表
 * @param { type String(字串) } tagType 標籤類別
 * @exapmle {
 * tagType = "SERVICE", "PRODUCT", "CATEGORY"
 * }
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const TagSelectListApi = (tagType, operatorId) => {
    return axios.post(`${apiConfig}/tag/selectLists`, { tagType, operatorId });
}
/**
 * 新增標籤
 * @param { type Object(物件) } data
 * @example {
 *   name: type String(字串) 標籤名稱
 *   key: type String(字串) 標籤代碼
 *   active: type Boolean(布林格式) 判斷是否啟用此標籤
 *   operator_ids: type Array(陣列) 可使用此群組的管理者id
 *   permission_rule: type String(字串) 數位權限值 1=設計師 2=管理者
 * }
 */
 export const AddTagApi = (data) => {
    return axios.put(`${apiConfig}/tag/create`, data);
};
/**
 * 更新標籤
 * @param { type Object(物件) } data
 * @example {
 *   tag_id type Number or String(數字或字串) 標籤id
 *   name: type String(字串) 標籤名稱 (非必要值)
 *   key: type String(字串) 標籤代碼 (非必要值)
 *   active: type Boolean(布林格式) 判斷是否啟用此標籤 (非必要值)
 *   operator_ids: type Array(陣列) 可使用此群組的管理者id (非必要值)
 *   permission_rule: type String(字串) 數位權限值 1=設計師 2=管理者 (非必要值)
 * }
 */
 export const UpdateTagApi = (data) => {
    return axios.put(`${apiConfig}/tag/update`, data);
};
/**
 * 取得單一標籤資料
 * @param { type String } tagId 標籤id
 */
 export const TagDataApi = (tagId) => {
    return axios.post(`${apiConfig}/tag/getData`, { tagId });
};