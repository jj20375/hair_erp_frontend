import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得助理列表
 * @param { type Object(物件) } data 分頁過濾參數
 * @example {
 * account: 助理帳號 type String(字串)
 * name: 助理名稱 type String(字串)
 * status: 狀態值 type Number(數字)
 * sort: ["assistant_id|DESC"] 排序 type Array(陣列)
 * perPage: 一頁幾筆資料 type Number(數字)
 * }
 */
export const AssistantUserListApi = (data) => {
    return axios.post(`${apiConfig}/userAssistant/lists`, data);
};
/**
 * 取得指定id專屬助理列表
 * @param { type Object(物件) } data 分頁過濾參數
 * @example {
 * account: 助理帳號 type String(字串)
 * name: 助理名稱 type String(字串)
 * status: 狀態值 type Number(數字)
 * sort: ["assistant_id|DESC"] 排序 type Array(陣列)
 * perPage: 一頁幾筆資料 type Number(數字)
 * }
 */
export const AssistantUserListByIdApi = (data) => {
    return axios.post(`${apiConfig}/userAssistant/listsById`, data);
};
/**
 * 取得可選擇助理列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const AssistantSelectListApi = (operatorId) => {
    return axios.post(`${apiConfig}/userAssistant/selectLists`, { operatorId });
}
/**
 * 取得助理單一資料
 * @param { type String } account 助理帳號
 */
export const AssistantUserDataApi = (account) => {
    return axios.post(`${apiConfig}/userAssistant/getData`, { account });
};
/**
 * 新增助理
 * @param { type Objcet } data 新增助理資料
 * @example {
 * operator_id: 管理者id type Number or String(數字或字串)
 * group_id: 群組id type Number or String(數字或字串)
 * account: 帳號 type String(字串)
 * name: 名稱 type String(字串)
 * password: 密碼 type String(字串)
 * status: 狀態值 type Number or String(數字或字串)
 * remarks: 備註 type String(數字或字串) 非必要值
 * note: 描述資料 type String(數字或字串) 非必要值
 * }
 */
export const AddAssistantApi = (data) => {
    return axios.post(`${apiConfig}/userAssistant/create`, data);
};
/**
 * 更新助理
 * @param { type Objcet } data 更新助理資料
 * @example {
 * assistant_id: 助理id type Number or String(數字或字串)
 * operator_id: 管理者id type Number or String(數字或字串)
 * user_id: 助理 users表 id type Number or String(數字或字串)
 * name: 名稱 type String(字串) 非必要值
 * password: 密碼 type String(字串) 非必要值
 * group_id: 群組id type Number or String(數字或字串) 非必要值
 * status: 狀態值 type Number or String(數字或字串)
 * remarks: 備註 type String(數字或字串) 非必要值
 * note: 描述資料 type String(數字或字串) 非必要值
 * }
 */
export const UpdateAssistantApi = (data) => {
    return axios.post(`${apiConfig}/userAssistant/update`, data);
};

/**
 * 刪除助理圖片
 * @param { type String } imgPath 圖片路徑
 * @param { type String or Number (字串或數字) } assistantId 助理id
 * @returns
 */
export const DeleteAssistantImageApi = (imgPath, assistantId) => {
    return axios.delete(`${apiConfig}/userAssistant/deleteImage`, {
        data: { imgPath, assistantId },
    });
};
