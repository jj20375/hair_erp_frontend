import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得群組列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * group_name: 群組名稱 type String(字串)
 * group_code: 群組代碼 type String(字串)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["group_id|DESC"] 排序 type Array(陣列) 
 * }
 */
export const GroupListApi = (data) => {
    return axios.post(`${apiConfig}/group/lists`, data);
};
/**
 * 取得可選擇群組列表
 * @param { type String(字串) } groupCode 群組代碼
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 * @param { type Boolean(布林值) } isSub 判斷是否為子帳號
 */
export const GroupSelectListApi = (groupCode, operatorId, isSub = false) => {
    return axios.post(`${apiConfig}/group/selectLists`, { groupCode, operatorId, isSub });
}

/**
 * 新增群組
 * @param { type Object(物件) } data
 * @example {
 *   group_code: type String(字串) 群組代碼
 *   group_name: type String(字串) 群組名稱
 *   operator_ids: type Array(陣列) 可使用此群組的管理者id
 *   permission_rule: type String(字串) 數位權限值 1=系統 2=管理者 4=設計師 8=助理 16=會員
 * }
 */
export const AddGroupApi = (data) => {
    return axios.put(`${apiConfig}/group/create`, data);
};
/**
 * 更新群組
 * @param { type Object(物件) } data
 * @example {
 *   group_id: type String or Number(字串或數字) 群組id
 *   group_name: type String(字串) 群組名稱
 *   operator_ids: type Array(陣列) 可使用此群組的管理者id
 *   permission_rule: type String(字串) 數位權限值 1=系統 2=管理者 4=設計師 8=助理 16=會員
 * }
 */
export const UpdateGroupApi = (data) => {
    return axios.put(`${apiConfig}/group/update`, data);
};
/**
 * 取的單一群組資料
 * @param { type String or Number(字串或數字) } groupId
 */
export const GroupDetailApi = (groupId) => {
    return axios.post(`${apiConfig}/group/getData`, { groupId });
};