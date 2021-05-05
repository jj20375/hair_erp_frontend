import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 新增樣板
 * @param { type Object } data 新增樣板資料
 * @example {
 * operator_ids: 可使用的管理者id type Array(陣列格式) 非必填
 * public: 是否為共用樣板 type Boolean(Boolean格式)
 * active: 是否啟用樣板 type Boolean(Boolean格式)
 * tmp_code: 樣板代碼 type String(字串格式)
 * img_path: 樣板預覽圖圖片路徑 type File(檔案格式) 非必填
 * }
 */
export const AddTemplateApi = (data) => {
    return axios.post(`${apiConfig}/template/create`, data);
};
/**
 * 更新樣板
 * @param { type Object } data 更新樣板資料
 * @example {
 * template_id: 樣板id type String or Number(字串或數字)
 * operator_ids: 可使用的管理者id type Array(陣列格式) 非必填
 * public: 是否為共用樣板 type Boolean(Boolean格式)
 * active: 是否啟用樣板 type Boolean(Boolean格式)
 * tmp_code: 樣板代碼 type String(字串格式)
 * img_path: 樣板預覽圖圖片路徑 type File(檔案格式) 非必填
 * }
 */
export const UpdateTemplateApi = (data) => {
    return axios.post(`${apiConfig}/template/update`, data);
};

/**
 * 取得樣板資料
 * @param { type String or Number(字串或數字) } templateId 樣板id
 */
export const TemplateDetailApi = (templateId) => {
    return axios.post(`${apiConfig}/template/getData`, { templateId });
};
/**
 * 取得樣板列表資料
 * @param { type Object(物件) } data 分頁過濾參數
 * @example {
 * tmp_code: 樣板代碼
 * perPage: 一頁幾筆資料
 * sort: ["template_id|DESC"] 倒序
 * }
 */
export const TemplateListApi = (data) => {
    return axios.post(`${apiConfig}/template/lists`, data);
};
/**
 * 取的可選擇樣板
 * @param { type String or Number(字串或數ㄗ) } operatorId 管理者id
 */
export const TemplateSelectListApi = (operatorId) => {
    return axios.post(`${apiConfig}/template/selectLists`, { operatorId });
}