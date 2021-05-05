// /**
//  *
//  * @param {array} userRouter 後台返回的用戶權限json
//  * @param {array} allRouter 前端配置好的所有動態路由的集合
//  * @return {Array} permissionRoutes 過濾後的權限路由
//  */
// export function permissionRouter(userRouter = [], allRouter = []) {
//     let permissionRoutes = [];
//     // let userJson = objToJsonKey(userRouter, "name");
//     allRouter.forEach((value, i) => {
//         if (userRouter[value.key]) {
//             //加入控制及權限
//             value.isMenu = userJson[value.key].isMenu;
//             value.isSub = userJson[value.key].isSub;

//             value.meta.params = {
//                 // Create: userJson[value.key].Create,
//                 Create: 1,
//                 // Read: userJson[value.key].Read,
//                 Read: 1,
//                 // Update: userJson[value.key].Update,
//                 Update: 1,
//                 // Delete: userJson[value.key].Delete,
//                 Delete: 1,
//             };
//             value.meta.subAct = userJson[value.key].subAct ? userJson[value.key].subAct : [];

//             //判斷是否有下選單
//             if (value.children && value.children.length > 0) {
//                 value.children = permissionRouter(userJson[value.key].children, value.children);
//             }
//             permissionRoutes.push(value);
//         }
//         // permissionRoutes.push(value);
//     });
//     return permissionRoutes;
// }

// /**
//  * 將物件給json化，並將索引key指定。
//  * @param obj   指定物件
//  * @param indexKey  對應key
//  * @returns {[]}
//  */
// export function objToJsonKey(obj, indexKey) {
//     let json = [];
//     obj = Object.values(obj);
//     obj.forEach((value, i) => {
//         json[value[indexKey]] = value;
//     });
//     return json;
// }

//原設計
export function permissionRouter(userRouter = [], allRouter = []) {
    // 過濾後的 routes
    let permissionRoutes = [];
    // let permissionRoutes = allRouter;
    allRouter.forEach((value, i) => {
        userRouter.forEach((item, index) => {
            // 權限路由過濾 全部路由的名稱跟使用者權限路由比較 如果有相同再繼續執行
            if (item.key === value.name) {
                // 判斷此路由是否有 新增｜更新｜刪除權限
                value.meta.params = {
                    Create: item.crud.per_create,
                    // Create: 1,
                    Read: item.crud.per_read,
                    // Read: 1,
                    Update: item.crud.per_update,
                    // Update: 1,
                    Delete: item.crud.per_delete,
                    // Delete: 1,
                };
                // 判斷是否為選單用路由
                value.meta.isMenu = item.is_menu;
                // 判斷是否有子項功能
                if(item.options.length > 0) {
                    value.meta.options = JSON.parse(item.options);
                } else {
                    value.meta.options = [];
                }
                // 如果有子選單且數量大於0
                if (item.children && item.children.length > 0) {
                    // callback 呼叫自己遞回
                    value.children = permissionRouter(
                        item.children,
                        value.children
                    );
                }
                permissionRoutes.push(value);
            }
        });
    });
    return permissionRoutes;
}
/**
 *
 * @param {Array} routes 用戶過濾後的路由
 *
 * 遞迴為所有有子路由的路由設置第一個children.path為默認路由
 */
export function setDefaultRoute(routes) {
    routes.forEach((value, index) => {
        // 判斷路由的children大於0
        if (value.children && value.children.length > 0) {
            value.redirect = { name: value.children[0].name };
            // setDefaultRoute(value.children);
        }
    });
}
