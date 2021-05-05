import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得產品列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 產品名稱 type String(字串)
 * key: 產品代碼 type String(字串)
 * price: 產品價格 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["product_id|DESC"] 排序 type Array(陣列) 
 * operatorId: 管理者id type Number or String(數字或字串)
 * }
 */
 export const ProductListApi = (data) => {
    return axios.post(`${apiConfig}/product/lists`, data);
};
/**
 * 取得產品列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 產品名稱 type String(字串)
 * key: 產品代碼 type String(字串)
 * price: 產品價格 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * status: 狀態 type Number or String(數字或字串)
 * sort: ["product_id|DESC"] 排序 type Array(陣列) 
 * operatorId: 管理者id type Number or String(數字或字串)
 * }
 */
 export const ProductListByIdApi = (data) => {
    return axios.post(`${apiConfig}/product/listsById`, data);
};
/**
 * 取得可選擇產品列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const ProductSelectListApi = (operatorId) => {
    return axios.post(`${apiConfig}/product/selectLists`, { operatorId });
}
/**
 * 取得可選擇屬於商品的產品列表
 * @param { type Number or String(字串或數字) } operatorId 管理者id
 */
 export const ProductSelectListByCommodityApi = (operatorId) => {
    return axios.post(`${apiConfig}/product/selectListsByCommodity`, { operatorId });
}
/**
 * 新增產品
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   category_id: type Number or String(數字或字串) 分類id
 *   provider_id: type Number or String(數字或字串) 廠商id
 *   name: type String(字串) 產品名稱
 *   key: type String(字串) 產品價格
 *   price: type Number(數字) 產品代碼
 *   status: type Number or String(字串或數字) 產品狀態
 *   operator_ids: type Array(陣列) 可使用此產品的管理者id (非必要值)
 *   note: type String(字串) 產品詳情 (非必要值)
 *   tagIds: type Array(陣列) 標籤id (非必要值)
 * }
 */
 export const AddProductApi = (data) => {
    return axios.post(`${apiConfig}/product/create`, data);
};
/**
 * 更新產品
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   product_id type Number or String(數字或字串) 產品id
 *   category_id: type Number or String(數字或字串) 分類id
 *   provider_id: type Number or String(數字或字串) 廠商id
 *   name: type String(字串) 產品名稱 (非必要值)
 *   key: type String(字串) 產品代碼 (非必要值)
 *   status: type Number or String(字串或數字) 產品狀態 (非必要值)
 *   operator_ids: type Array(陣列) 可使用此產品的管理者id (非必要值)
 *   note: type String(字串) 產品詳情 (非必要值)
 *   tagIds: type Array(陣列) 標籤id (非必要值)
 * }
 */
 export const UpdateProductApi = (data) => {
    return axios.post(`${apiConfig}/product/update`, data);
};
/**
 * 取得單一產品資料
 * @param { type String or Number(字串或數字) } productId 產品id
 */
 export const ProductDataApi = (productId) => {
    return axios.post(`${apiConfig}/product/getData`, { productId });
};
/**
 * 刪除產品圖片
 * @param { type String } imgPath 圖片路徑
 * @param { type String or Number (字串或數字) } productId 產品id
 * @returns
 */
 export const DeleteProductImageApi = (imgPath, productId) => {
    return axios.delete(`${apiConfig}/product/deleteImage`, {
        data: { imgPath, productId },
    });
};