import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 取得群組權限樹狀資料
 * @param { type String or Number(字串或數字) } groupCode 群組代碼
 */
export const GroupTreePermissionApi = (groupCode) => {
    return axios.post(`${apiConfig}/permissionGroup/showPermissionTree`, { groupCode });
};
/**
 * 取得群組權限列表資料
 * @param { type String or Number(字串或數字) } groupCode 群組代碼
 */
export const GroupPermissionListsApi = (groupCode) => {
    return axios.post(`${apiConfig}/permissionGroup/showPermission`, { groupCode });
};
/**
 * 取得群組權限crud資料
 * @param { type String or Number(字串或數字) } groupCode 群組代碼
 * @param { type String or Number(字串或數字) } groupId 群組id
 */
export const GroupPermissionCRUDApi = (groupCode, groupId) => {
    return axios.post(`${apiConfig}/permissionGroup/showPermissionCrud`, { groupCode, groupId });
};

/**
 * 更新群組權限
 * @param { type Array } $datas 更新群組權限資料
 * @example {
 *   group_id: type String or Number(字串或數字) 角色群組id
 *   options: type Array(陣列) 新增是否有子項功能 key 
 *   key: typeString(字串) vue-router 路由對應key
 *   per_create: type Array(陣列) 路由 key (vue route 的 name 值)
 *   per_read: type Array(陣列) 路由 key (vue route 的 name 值)
 *   per_update: type Array(陣列) 路由 key (vue route 的 name 值)
 *   per_delete: type Array(陣列) 路由 key (vue route 的 name 值)
 * }
 */
export const UpdateGroupPermissionApi = ($datas) => {
    return axios.put(`${apiConfig}/permissionGroup/update`, $datas);
}
// 取得使用者可操作權限(路由或功能)
export const GroupPermissionMenuApi = () => {
    return axios.get(`${apiConfig}/permissionGroup/getMenu`);
}