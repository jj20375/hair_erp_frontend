import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得今日與昨日業績
 * @param { type String Or Number(字串或數字) } operator_id 管理者id
 */
export const nowDayAndYesterDayPerformanceApi = (operator_id) => {
    return axios.put(`${apiConfig}/dashboard/nowAndYesterPerformance`, { operator_id });
};
/**
 * 取得今日與昨日儲值額度
 * @param { type String Or Number(字串或數字) } operator_id 管理者id
 */
export const nowDayAndYesterDayPointApi = (operator_id) => {
    return axios.put(`${apiConfig}/dashboard/nowAndYesterPoint`, { operator_id });
};
/**
 * 取得今日與昨日會員註冊數
 * @param { type String Or Number(字串或數字) } operator_id 管理者id
 */
export const nowDayAndYesterDayMemberRegisterTotaltApi = (operator_id) => {
    return axios.put(`${apiConfig}/dashboard/nowAndYesterMemberRegister`, { operator_id });
};
/**
 * 取得本週設計師業績
 * @param { type String Or Number(字串或數字) } operator_id 管理者id
 */
export const weekDesignerPerformanceApi = (operator_id) => {
    return axios.put(`${apiConfig}/dashboard/weekDesignerPerformance`, { operator_id });
};
/**
 * 取得本週與上週管理者總業績
 * @param { type String Or Number(字串或數字) } operator_id 管理者id
 */
export const nowAndLastWeekOperatorPerformanceApi = (operator_id) => {
    return axios.put(`${apiConfig}/dashboard/nowAndLastWeekOperatorPerformance`, { operator_id });
};
/**
 * 取得今日壽星
 * @param { type String Or Number(字串或數字) } operator_id 管理者id
 */
export const nowDayBirthdayMemberApi = (operator_id) => {
    return axios.put(`${apiConfig}/dashboard/nowDayBirthdayMember`, { operator_id });
};
