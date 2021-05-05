import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 新增管理者
 * @param { type Object(物件)
 * acccount: 帳號 type String(字串)
 * password: 密碼 type String(字串)
 * name: 管理者名稱 type String(字串)
 * status: 管理者狀態 type Number or String(數字或字串)
 * group_id: 群組id type Number or String(數字或字串)
 * remarks: 備註 type String(字串) 非必要
 *  } data
 */
export const AddOperatorApi = (data) => {
    return axios.put(`${apiConfig}/userOperator/create`, data);
};
/**
 * 更新管理者詳細資料
 * @param { type Object(物件)
 * user_id: 更新users表id
 * operator_id: 更新管理者id
 * password: 密碼 type String(字串) 非必要
 * name: 管理者名稱 type String(字串)
 * status: 管理者狀態 type Number or String(數字或字串)
 * remarks: 備註 type String(字串) 非必要
 * group_id: 群組ID type Number or String(數字或字串)
 * http_type: 用來判斷使用 http 或 https 預設值為 http (type String(字串))
 * domain: 網址 type String(字串)
 * port: 網站 port 非必要 type String(字串)
 * template: 網站樣板 type String(字串)
 * logo: 網站logo或企業logo type File(檔案格式))
 *  } data
 */
export const UpdateOperatorApi = (data) => {
    return axios.post(`${apiConfig}/userOperator/updateInfo`, data);
};
/**
 * 更新管理者狀態值
 * @param { type Object(物件)
 * operator_id: 更新管理者id
 * user_id: users表id
 * status: 狀態值 type Number(數字)
 *  } data
 */
export const UpdateOperatorStatusApi = (data) => {
    return axios.put(`${apiConfig}/userOperator/updateStatus`, data);
};
/**
 * 取得管理者層級列表
 * @param { type String or Number(字串或數字) } operatorId 管理者id
 */
export const OperatorUserListApi = (operatorId) => {
    return axios.post(`${apiConfig}/userOperator/lists`, { operatorId });
};
/**
 * 取得可選擇管理者列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const OperatorSelectListApi = (operatorId) => {
    return axios.put(`${apiConfig}/userOperator/selectLists`, { operatorId });
}

/**
 * 取得管理者樹狀列表
 * @param { type String or Number(字串或數字) } operatorId 管理者id
 */
export const OperatorUserTreeListsApi = (operatorId) => {
    return axios.post(`${apiConfig}/userOperator/treeLists`, { operatorId });
};

/**
 * 取得管理者資料
 * @param { type String or Number(字串或數字) } account 管理者帳號
 */
export const OperatorUserDataApi = (account) => {
    return axios.post(`${apiConfig}/userOperator/getData`, { account });
};
/**
 * 新增管理者技術項目
 * @param { type Object(物件) } data 新增技術項目資料
 * @example {
 * category_id: type Number or String(數字或字串) 分類id
 * designerId: type Number or String(數字或字串) 設計師id
 * name: type String(字串) 技術項目
 * price: type Number(數字) 價位
 * operator_ids type Array(陣列) 管理者id (非必須)
 * }
 */
export const CreateOperatorServiceApi = (data) => {
    return axios.put(`${apiConfig}/userOperator/createService`, data);
};
/**
 * 更新管理者技術項目
 * @param { type Object(物件) } data 更新技術項目資料
 * @example {
 * type Number or String(數字或字串) 服務id
 * designerId: type Number or String(數字或字串) 設計師id
 * category_id: type Number or String(數字或字串) 分類id (非必須)
 * name: type String(字串) 技術項目 (非必須)
 * price: type Number(數字) 價位 (非必須)
 * operator_ids type Array(陣列) 管理者id (非必須)
 * }
 */
export const UpdateOperatorServiceApi = (data) => {
    return axios.put(`${apiConfig}/userOperator/updateService`, data);
};
/**
 * 管理者技術項目列表
 * @param { Number or String(數字或字串) } operatorId 管理者id
 * @param { type Object(物件) } data 分頁搜尋過濾條件
 */
export const OperatorServiceListsApi = (operatorId, data = null) => {
    let sendData = data === null ? {} : data;
    sendData["operatorId"] = operatorId;
    return axios.put(`${apiConfig}/userOperator/serviceLists`, sendData);
};
/**
 * 取得可選擇管理者技術項目
 * @param { Number or String(數字或字串) } operatorId 管理者id
 */
export const OperatorServiceSelectListsApi = (operatorId) => {
    return axios.put(`${apiConfig}/userOperator/serviceSelectLists`, {operatorId});
};
