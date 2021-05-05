import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得商品列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 商品名稱 type String(字串)
 * key: 商品代碼 type String(字串)
 * price: 商品價格 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["commodity_id|DESC"] 排序 type Array(陣列) 
 * operatorId: 管理者id type Number or String(數字或字串)
 * }
 */
 export const CommodityListApi = (data) => {
    return axios.post(`${apiConfig}/commodity/lists`, data);
};
/**
 * 取得商品列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 商品名稱 type String(字串)
 * key: 商品代碼 type String(字串)
 * price: 商品價格 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["commodity_id|DESC"] 排序 type Array(陣列) 
 * operatorId: 管理者id type Number or String(數字或字串)
 * }
 */
 export const CommodityListByIdApi = (data) => {
    return axios.post(`${apiConfig}/commodity/listsById`, data);
};
/**
 * 取得可選擇商品列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const CommoditySelectListApi = (operatorId) => {
    return axios.post(`${apiConfig}/commodity/selectLists`, { operatorId });
}
/**
 * 新增商品
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   name: type String(字串) 商品名稱
 *   key: type String(字串) 商品價格
 *   price: type Number(數字) 商品代碼
 *   status: type Number or String(字串或數字) 商品狀態
 *   operator_ids: type Array(陣列) 可使用此商品的管理者id (非必要值)
 *   note: type String(字串) 商品詳情 (非必要值)
 *   productIds: type Array(陣列) 產品id
 * }
 */
 export const AddCommodityApi = (data) => {
    return axios.post(`${apiConfig}/commodity/create`, data);
};
/**
 * 更新商品
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   name: type String(字串) 商品名稱 (非必要值)
 *   key: type String(字串) 商品代碼 (非必要值)
 *   status: type Number or String(字串或數字) 商品狀態 (非必要值)
 *   operator_ids: type Array(陣列) 可使用此商品的管理者id (非必要值)
 *   note: type String(字串) 商品詳情 (非必要值)
 *   productIds: type Array(陣列) 產品id
 * }
 */
 export const UpdateCommodityApi = (data) => {
    return axios.post(`${apiConfig}/commodity/update`, data);
};
/**
 * 取得單一商品資料
 * @param { type String or Number(字串或數字) } commodityId 商品id
 */
 export const CommodityDataApi = (commodityId) => {
    return axios.post(`${apiConfig}/commodity/getData`, { commodityId });
};
/**
 * 刪除商品圖片
 * @param { type String } imgPath 圖片路徑
 * @param { type String or Number (字串或數字) } commodityId 商品id
 * @returns
 */
 export const DeleteCommodityImageApi = (imgPath, commodityId) => {
    return axios.delete(`${apiConfig}/commodity/deleteImage`, {
        data: { imgPath, commodityId },
    });
};