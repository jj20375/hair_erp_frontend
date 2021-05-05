import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 管理者登入api
 * @param { type Object(物件)
 * account: 帳號 type String(字串)
 * password: 密碼 type String(字串)
 *  } data
 */
export const LoginApi = (data) => {
    return axios.post(`${apiConfig}/login`, data);
};
// 更新 token api
export const RefreshTokenApi = () => {
    return axios.get(`${apiConfig}/user/refreshToken`);
};
// 取得登入使用者資料
export const LoginUserInfoApi = () => {
    return axios.get(`${apiConfig}/user/getData`);
};
// 取得使用者可操作權限(路由或功能)
export const UserMenuApi = () => {
    return axios.get(`${apiConfig}/user/menu`);
}
/**
 * 更新使用者資料
 * @param { type Object(物件) } data 更新資料
 * @example {
 *   user_id: { type Sting or Number(字串或數字) } 使用者id
 *   password: { type Sting(字串) } 密碼 (非必要值)
 *   name: { type Sting(字串) } 名稱 (非必要值)
 * }
 */
export const UserUpdateApi = (data) => {
    return axios.put(`${apiConfig}/user/update`, data);
}