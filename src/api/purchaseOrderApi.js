import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得進貨訂單列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * title: 進貨訂單名稱 type String(字串)
 * order_number: 進貨訂單號 type String(字串)
 * order_operator_number: 客製化進貨訂單號 type String(字串)
 * total: 進貨訂單價格 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["purchase_order_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const PurchaseOrderListApi = (data) => {
    return axios.post(`${apiConfig}/purchaseOrder/lists`, data);
};
/**
 * 取得進貨訂單列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * title: 進貨訂單名稱 type String(字串)
 * order_number: 進貨訂單號 type String(字串)
 * order_operator_number: 客製化進貨訂單號 type String(字串)
 * total: 進貨訂單價格 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["purchase_order_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const PurchaseOrderListByIdApi = (data) => {
    return axios.post(`${apiConfig}/purchaseOrder/listsById`, data);
};

/**
 * 新增進貨訂單
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: ype Number or String(字串或數字) 管理者id
 *   category_id: type Number or String(數字或字串) 分類id
 *   provider_id: type Number or String(數字或字串) 廠商id
 *   name: type String(字串) 進貨訂單名稱
 *   key: type String(字串) 進貨訂單價格
 *   price: type Number(數字) 進貨訂單代碼
 *   operator_ids: type Array(陣列) 可使用此進貨訂單的管理者id (非必要值)
 *   note: type String(字串) 進貨訂單詳情 (非必要值)
 *   tagIds: type Array(陣列) 標籤id (非必要值)
 * }
 */
 export const AddPurchaseOrderApi = (data) => {
    return axios.put(`${apiConfig}/purchaseOrder/create`, data);
};
/**
 * 更新進貨訂單
 * @param { type Object(物件) } data
 * @example {
 *   operator_id: type Number or String(字串或數字) 管理者id
 *   product_id type Number or String(數字或字串) 進貨訂單id
 *   category_id: type Number or String(數字或字串) 分類id
 *   provider_id: type Number or String(數字或字串) 廠商id
 *   name: type String(字串) 進貨訂單名稱 (非必要值)
 *   key: type String(字串) 進貨訂單代碼 (非必要值)
 *   status: type Number or String(字串或數字) 進貨訂單狀態 (非必要值)
 *   operator_ids: type Array(陣列) 可使用此進貨訂單的管理者id (非必要值)
 *   note: type String(字串) 進貨訂單詳情 (非必要值)
 *   tagIds: type Array(陣列) 標籤id (非必要值)
 * }
 */
 export const UpdatePurchaseOrderApi = (data) => {
    return axios.put(`${apiConfig}/purchaseOrder/update`, data);
};
/**
 * 取得單一進貨訂單資料
 * @param { type String or Number(字串或數字) } purchaseOrderNumber 進貨訂單編號
 */
 export const PurchaseOrderDataApi = (purchaseOrderNumber) => {
    return axios.post(`${apiConfig}/purchaseOrder/getData`, { purchaseOrderNumber });
};