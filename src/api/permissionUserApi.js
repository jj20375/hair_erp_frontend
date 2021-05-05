import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得個人權限樹狀資料
 * @param { type String or Number(字串或數字) } groupCode 群組代碼
 */
export const UserTreePermissionApi = (groupCode) => {
    return axios.post(`${apiConfig}/permissionUser/showPermissionTree`, { groupCode });
};
/**
 * 取得個人權限列表資料
 * @param { type String or Number(字串或數字) } groupCode 群組代碼
 */
export const UserPermissionListsApi = (groupCode) => {
    return axios.post(`${apiConfig}/permissionUser/showPermission`, { groupCode });
};
/**
 * 取得個人權限crud資料
 * @param { type String or Number(字串或數字) } groupCode 群組代碼
 * @param { type String or Number(字串或數字) } userId users 表 id
 */
export const UserPermissionCRUDApi = (groupCode, userId) => {
    return axios.post(`${apiConfig}/permissionUser/showPermissionCrud`, { groupCode, userId });
};

/**
 * 更新個人權限
 * @param { type Array } $datas 更新群組權限資料
 * @example {
 *   user_id: type String or Number(字串或數字) 角色群組id
 *   options: type Array(陣列) 新增是否有子項功能 key 
 *   key: typeString(字串) vue-router 路由對應key
 *   per_create: type Array(陣列) 路由 key (vue route 的 name 值)
 *   per_read: type Array(陣列) 路由 key (vue route 的 name 值)
 *   per_update: type Array(陣列) 路由 key (vue route 的 name 值)
 *   per_delete: type Array(陣列) 路由 key (vue route 的 name 值)
 * }
 */
export const UpdateUserPermissionApi = ($datas) => {
    return axios.put(`${apiConfig}/permissionUser/update`, $datas);
};
// 取得使用者可操作權限(路由或功能)
export const UserPermissionMenuApi = () => {
    return axios.get(`${apiConfig}/permissionUser/getMenu`);
}
