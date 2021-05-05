import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

// 取得權限樹狀列表
export const PermissionRouteTreeListApi = () => {
    return axios.get(`${apiConfig}/permissionDefault/treeLists`);
};
/**
 * 新增預設權限資料
 * @param { type Object(物件) } data 表單傳送值
 * @example {
 * parent_id : 上層權限id 如果是新增最上層 傳入0
 * custom_key: 指定路由名稱 (vue rotue 的 name)
 * key: vue route 的 name
 * have_options: type Array(新增值為對應key) 新增vue-router頁面中是否有子項功能 ex: ["accountControl_system"]
 * permission_rule: type Number(數字) 數位權限值 1=系統 2=管理者 4=設計師 8=助理 16=會員
 * class: vue route name 前綴 ex: system_permission_list 前綴為 system
 * func: vue route name 去掉前綴後字串 ex: system_permission_list 為 permission_list
 * is_menu: 判斷是否為選單路由用
 * route_set: 暫時沒有用處 可不傳值
 * is_option 判斷是否為子功能
 *  }
 */
export const AddPermissionRouteDataApi = (data) => {
    return axios.put(`${apiConfig}/permissionDefault/create`, data);
};
/**
 * 更新路由資料
 * @param { type Object(物件) } data 表單傳送值
 * @example {
 * parent_id : 上層權限id 如果是新增最上層 傳入0
 * custom_key: 客製化指定路由名稱 (vue rotue 的 name)
 * key: vue route 的 name
 * have_options: type Array(新增值為對應key) 新增vue-router頁面中是否有子項功能 ex: ["accountControl_system"]
 * permission_rule: type Number(數字) 數位權限值 1=系統 2=管理者 4=設計師 8=助理 16=會員
 * class: vue route name 前綴 ex: system_permission_list 前綴為 system
 * func: vue route name 去掉前綴後字串 ex: system_permission_list 為 permission_list
 * is_menu: 判斷是否為選單路由用
 * route_set: 暫時沒有用處 可不傳值
 * is_option 判斷是否為子功能
 *  }
 */
export const UpdatePermissionRouteDataApi = (data) => {
    return axios.put(`${apiConfig}/permissionDefault/update`, data);
};
/**
 * 刪除路由資料
 * @param { type String or Number(字串或數字) } permissionId 要刪除的資料 id
 */
export const DeletePermissionRouteDataApi = (permissionId) => {
    return axios.delete(`${apiConfig}/permissionDefault/delete`, {
        data: { permissionId },
    });
};
/**
 * 取得路由權限詳細資料
 * @param { type String or Number(字串或數字) } permissionId 路由權限 id
 */
export const PermissionRouteDetailApi = (permissionId) => {
    return axios.post(`${apiConfig}/permissionDefault/getData`, {
        permissionId,
    });
};
