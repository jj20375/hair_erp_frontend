import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得單一服務資料
 * @param { type String or Number(字串或數字) } serviceId 服務id
 * @param { type String(字串) } ableType 關聯表類型 (ex: "designer" or "operator")
 */
export const StoreServiceAbleDataApi = (serviceId, ableType) => {
    return axios.post(`${apiConfig}/service/getAbleData`, { serviceId, ableType });
};