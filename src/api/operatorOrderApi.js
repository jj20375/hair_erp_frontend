import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得商家訂單列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 商家訂單名稱 type String(字串)
 * order_number: 商家訂單代碼 type String(字串)
 * total: 商家訂單價格 type String or Number(字串或數字)
 * info_total: 商家訂單折扣後價格 type String or Number(字串或數字)
 * preferential_price: 商家訂單自定義折扣價 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["purchase_order_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const OperatorOrderListApi = (data) => {
    return axios.post(`${apiConfig}/operatorOrder/lists`, data);
};
/**
 * 取得商家訂單列表
 * @param { type Object 搜尋過濾參數 } data
 * @example {
 * name: 商家訂單名稱 type String(字串)
 * order_number: 商家訂單代碼 type String(字串)
 * total: 商家訂單價格 type String or Number(字串或數字)
 * info_total: 商家訂單折扣後價格 type String or Number(字串或數字)
 * preferential_price: 商家訂單自定義折扣價 type String or Number(字串或數字)
 * perPage: 一頁呈現幾筆資料 type Number or String(數字或字串)
 * sort: ["purchase_order_id|DESC"] 排序 type Array(陣列) 
 * }
 */
 export const OperatorOrderListByIdApi = (data) => {
    return axios.post(`${apiConfig}/operatorOrder/listsById`, data);
};

/**
 * 新增商家訂單
 * @param { type Object(物件) } data
 * @example {
 *   datas: [
 *      {
 *        orderType: type String(字串) storeService = 店家服務消費 commodity = 商品購買消費 判斷該筆訂單為商品銷售或者為店家服務消費(洗髮｜燙髮｜剪髮等等),
 *        orderTypeId: type String or Number(字串或數字) 消費類型id(店家服務id或者販售商品id)
 *        title: type String(字串) 該筆訂單消費標題
 *        designer_id: type String or Number(字串或數字) 設計師id,
 *        help_designer_id: type String or Number(字串或數字) 協助設計師id(有協助才需傳入 非必要值),
 *        help_assistant_id: type String or Number(字串或數字) 協助助理id(有協助才需傳入 非必要值),
 *        seller_id: type String or Number(字串或數字) 銷售商品人員 user_id(該筆訂單為商品購買時需傳入 非必要值),
 *        commission: Number(數字) 該筆訂單抽成,
 *        quantity: Number(數字) 商品訂單數量(如果是店家服務的訂單類型 請傳入1),
 *        pre_quantity: Number(數字) 商品訂單預購數量(如果是店家服務的訂單類型 請傳入0),
 *        preferential_price: Number(數字) 該筆訂單折扣後價格(如果沒有折扣則傳入0),
 *        price: Number(數字) 該筆訂單原訂價格,
 *      } 
 *   ],
 *   operator_id: type String or Number(字串或數字) 管理者id,
 *   order_date: type Date(日期) 訂單日期
 *   type: type String(字串) creditCar = 信用卡 cash = 現金 point = 點數 消費方式
 *   cash: type Number(數字) 選擇點數消費時，點數不足時支付的現金
 * }
 */
 export const AddOperatorOrderApi = (data) => {
    return axios.put(`${apiConfig}/operatorOrder/create`, data);
};
/**
 * 更新商家訂單
 * @param { type Object(物件) } data
 * @example {
 *   datas: [
 *      {
 *        operator_info_order_id: type String or Number(字串或數字) 商家訂單明細id
 *        orderType: type String(字串) storeService = 店家服務消費 commodity = 商品購買消費 判斷該筆訂單為商品銷售或者為店家服務消費(洗髮｜燙髮｜剪髮等等),
 *        orderTypeId: type String or Number(字串或數字) 消費類型id(店家服務id或者販售商品id)
 *        title: type String(字串) 該筆訂單消費標題
 *        designer_id: type String or Number(字串或數字) 設計師id,
 *        help_designer_id: type String or Number(字串或數字) 協助設計師id(有協助才需傳入 非必要值),
 *        help_assistant_id: type String or Number(字串或數字) 協助助理id(有協助才需傳入 非必要值),
 *        seller_id: type String or Number(字串或數字) 銷售商品人員 user_id(該筆訂單為商品購買時需傳入 非必要值),
 *        commission: Number(數字) 該筆訂單抽成,
 *        quantity: Number(數字) 商品訂單數量(如果是店家服務的訂單類型 請傳入1),
 *        pre_quantity: Number(數字) 商品訂單預購數量(如果是店家服務的訂單類型 請傳入0),
 *        preferential_price: Number(數字) 該筆訂單折扣後價格(如果沒有折扣則傳入0),
 *        price: Number(數字) 該筆訂單原訂價格,
 *      } 
 *   ],
 *   operator_order_id: type String or Number(字串或數字) 商家訂單id
 *   operator_id: type String or Number(字串或數字) 管理者id,
 *   order_date: type Date(日期) 訂單日期
 *   type: type String(字串) creditCar = 信用卡 cash = 現金 point = 點數 消費方式
 *   cash: type Number(數字) 選擇點數消費時，點數不足時支付的現金
 */
 export const UpdateOperatorOrderApi = (data) => {
    return axios.put(`${apiConfig}/operatorOrder/update`, data);
};
/**
 * 取得單一商家訂單資料
 * @param { type String or Number(字串或數字) } operatorOrderNumber 商家訂單編號
 */
 export const OperatorOrderDataApi = (operatorOrderNumber) => {
    return axios.post(`${apiConfig}/operatorOrder/getData`, { operatorOrderNumber });
};