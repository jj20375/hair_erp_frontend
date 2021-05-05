import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得會員列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 會員名稱 type String(字串)
 * nickname: 會員暱稱 type String(字串)
 * operator_id: 管理者id type String or Number(字串或數字)
 * account: 會員帳號 type String(字串)
 * birthday: 生日 type Date(日期格式)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["member_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const MemberListApi = (data) => {
    return axios.post(`${apiConfig}/userMember/lists`, data);
};
/**
 * 取得會員列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 會員名稱 type String(字串)
 * nickname: 會員暱稱 type String(字串)
 * operator_id: 管理者id type String or Number(字串或數字)
 * account: 會員帳號 type String(字串)
 * birthday: 生日 type Date(日期格式)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["member_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const MemberListByIdApi = (data) => {
    return axios.post(`${apiConfig}/userMember/listsById`, data);
};
/**
 * 取得可選擇會員列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const MemberSelectListApi = (operatorId) => {
    return axios.post(`${apiConfig}/userMember/selectLists`, { operatorId });
}
/**
 * 新增會員
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   name: type String(字串) 會員名稱
 *   nickname: type String(字串) 會員暱稱
 *   birthday: type Date(日期格式)) 生日
 *   account: type String(字串) 帳號
 *   password: type String(字串) 密碼
 *   status: type Number or String(字串或數字) 會員狀態
 *   note: type String(字串) 會員備註 (非必要值)
 * }
 */
 export const AddMemberApi = (data) => {
    return axios.put(`${apiConfig}/userMember/create`, data);
};
/**
 * 更新會員
 * @param { type Object(物件) } data
 * @example {
 *   member_id: type String or Number(字串或數字) 會員id 
 *   user_id: type String or Number(字串或數字) users表id 
 *   name: type String(字串) 會員名稱 (非必要值)
 *   password type String(字串) 更新密碼 (非必要值)
 *   nickname: type String(字串) 會員暱稱 (非必要值)
 *   birthday: type Date(日期格式)) 生日 (非必要值)
 *   status: type Number or String(字串或數字) 會員狀態 (非必要值)
 *   note: type String(字串) 會員備註 (非必要值)
 * }
 */
 export const UpdateMemberApi = (data) => {
    return axios.put(`${apiConfig}/userMember/update`, data);
};
/**
 * 取得單一會員資料
 * @param { type String (字串) } account 會員帳號
 */
 export const MemberDataApi = (account) => {
    return axios.post(`${apiConfig}/userMember/getData`, { account });
};
/**
 * 新增會員點數
 * @param { type Object (物件) } data 點數資料
 * @example {
 *   operatorId: type String or Number(字串或數字) 管理者id 
 *   memberId: type String or Number(字串或數字) 會員id
 *   member_info_id: type String or Number(字串或數字) 會員詳細資料表id
 *   point: type Number(數字) 點數
 *   remarks: type String(字串) 備註
 * }
 */
 export const AddMemberPointApi = (data) => {
    return axios.put(`${apiConfig}/userMember/addPoint`, data);
};