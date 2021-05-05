import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得子帳號列表
 * @param { type Object(物件) } data 分頁過濾參數
 * @example {
 * account: 助理帳號 type String(字串)
 * name: 助理名稱 type String(字串)
 * status: 狀態值 type Number(數字)
 * sort: ["assistant_id|DESC"] 排序 type Array(陣列)
 * perPage: 一頁幾筆資料 type Number(數字)
 * }
 */
export const SubUserListApi = (data) => {
    return axios.post(`${apiConfig}/userSub/lists`, data);
};
/**
 * 取得指定id專屬子帳號列表
 * @param { type Object(物件) } data 分頁過濾參數
 * @example {
 * account: 助理帳號 type String(字串)
 * name: 助理名稱 type String(字串)
 * status: 狀態值 type Number(數字)
 * sort: ["assistant_id|DESC"] 排序 type Array(陣列)
 * perPage: 一頁幾筆資料 type Number(數字)
 * }
 */
 export const SubUserListByIdApi = (data) => {
    return axios.post(`${apiConfig}/userSub/listsById`, data);
};
/**
 * 取得可選擇子帳號列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const SubUserSelectListApi = (operatorId) => {
    return axios.post(`${apiConfig}/userSub/selectLists`, { operatorId });
}
/**
 * 取得子帳號單一資料
 * @param { type String } account 子帳號設定帳號
 */
export const SubUserDataApi = (account) => {
    return axios.post(`${apiConfig}/userSub/getData`, { account });
};
/**
 * 新增子帳號
 * @param { type Objcet } data 新增子帳號資料
 * @example {
 * account: 帳號 type String(字串)
 * name: 名稱 type String(字串)
 * password: 密碼 type String(字串)
 * group_id: 群組id type Number or String(數字或字串)
 * operator_id: 管理者id type Number or String(數字或字串)
 * status: 狀態值 type Number or String(數字或字串)
 * remarks: 備註 type String(數字或字串) 非必要值
 * note: 描述資料 type String(數字或字串) 非必要值
 * }
 */
export const AddSubApi = (data) => {
    return axios.put(`${apiConfig}/userSub/create`, data);
};
/**
 * 更新子帳號
 * @param { type Objcet } data 更新子帳號資料
 * @example {
 * sub_id: 子帳號id type Number or String(數字或字串)
 * operator_id: 管理者id type Number or String(數字或字串) 非必要值
 * user_id: 子帳號users表id type Number or String(數字或字串) 非必要值
 * name: 名稱 type String(字串) 非必要值
 * password: 密碼 type String(字串) 非必要值
 * group_id: 群組id type Number or String(數字或字串) 非必要值
 * status: 狀態值 type Number or String(數字或字串)
 * remarks: 備註 type String(數字或字串) 非必要值
 * note: 描述資料 type String(數字或字串) 非必要值
 * }
 */
export const UpdateSubApi = (data) => {
    return axios.put(`${apiConfig}/userSub/update`, data);
};
