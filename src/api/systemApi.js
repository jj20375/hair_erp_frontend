import axios from "../config/httpConfig";
import { apiConfig } from "../../env";
/**
 * 新增系統帳號
 * @param { type Object(物件)
 * account:帳號
 * password:密碼
 * name:名稱
 * group_id:群組id
 * status: 狀態
 * remarks: 備註
 *  } data
 */
export const AddSystemApi = (data) => {
    return axios.put(`${apiConfig}/userSystem/create`, data);
};
/**
 * 更新系統人員
 * @param { type Object(物件)
 * system_id: 更新id
 * password:密碼
 * name:名稱
 * group_id:群組id
 * status: 狀態
 * remarks: 備註
 * } data
 */
export const UpdateSystemApi = (data) => {
    return axios.put(`${apiConfig}/userSystem/update`, data);
};
/**
 * 取得系統使用者列表
 * @param { type Object(物件) 傳入要過濾得搜尋條件
 * sort: 排序 type Array(陣列) ex: ["id|DESC"]
 * startDateTime: 開始時間 type String(字串) 時間格式
 * endDateTime: 結束時間 type String(字串) 時間格式
 * account: 帳號 type String(字串)
 * status: 狀態 type Number(數字)
 * } data 搜尋過濾條件
 */
export const SystemUserListApi = (data) => {
    return axios.post(`${apiConfig}/userSystem/lists`, data);
};
/**
 * 取得系統人員資料
 * @param { type String (字串) } account 系統使用者帳號
 */
export const SystemUserDataApi = (account) => {
    return axios.post(`${apiConfig}/userSystem/getData`, { account });
};
