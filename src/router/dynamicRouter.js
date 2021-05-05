const dynamicRoutes = [
    {
        path: "/system",
        name: "system",
        ico: "ni ni-settings",
        component: () => import("../views/layout/childLayout/ChildLayout.vue"),
        meta: {
            name: "system",
            text: "系統管理",
        },
        children: [
            {
                path: "system_permission_list",
                name: "system_permission_list",
                component: () => import("../views/permission/index.vue"),
                meta: {
                    name: "system_permission_list",
                    text: "路由權限",
                },
            },
            {
                path: "system_template_list",
                name: "system_template_list",
                component: () => import("../views/template/index.vue"),
                meta: {
                    name: "system_template_list",
                    text: "樣板列表",
                },
            },
            {
                path: "system_roles",
                name: "system_roles",
                component: () => import("../views/roleGroups/index.vue"),
                meta: {
                    name: "system_roles",
                    text: "群組列表",
                },
            },
            {
                path: "system_roles/:id/:groupCode",
                name: "system_roles_update",
                component: () =>
                    import("../views/roleGroups/PermissionSet.vue"),
                meta: {
                    name: "system_roles_update",
                    text: "群組權限設定",
                },
            },
        ],
    },
    {
        path: "/webControl",
        name: "webControl",
        ico: "ni ni-world",
        component: () => import("../views/layout/childLayout/ChildLayout.vue"),
        meta: {
            name: "webControl",
            text: "網站管理",
        },
        children: [
            {
                path: "webControl_category",
                name: "webControl_category",
                component: () => import("../views/category/index.vue"),
                meta: {
                    name: "webControl_category",
                    text: "分類",
                },
            },
            {
                path: "webControl_storeService/:operatorId?",
                name: "webControl_storeService",
                component: () => import("../views/storeService/index.vue"),
                meta: {
                    name: "webControl_storeService",
                    text: "技術",
                },
            },
            {
                path: "webControl_tag",
                name: "webControl_tag",
                component: () => import("../views/tag/index.vue"),
                meta: {
                    name: "webControl_tag",
                    text: "標籤",
                },
            },
        ],
    },
    {
        path: "/commodityControl",
        name: "commodityControl",
        ico: "ni ni-basket",
        component: () => import("../views/layout/childLayout/ChildLayout.vue"),
        meta: {
            name: "commodityControl",
            text: "商品管理",
        },
        children: [
            {
                path: "commodity_provider_list/:operatorId?",
                name: "commodity_provider_list",
                component: () => import("../views/provider/index.vue"),
                meta: {
                    name: "commodity_provider_list",
                    text: "廠商列表",
                },
            },
            {
                path: "commodity_product_list/:operatorId?",
                name: "commodity_product_list",
                component: () => import("../views/product/index.vue"),
                meta: {
                    name: "commodity_product_list",
                    text: "產品列表",
                },
            },
            {
                path: "commodity_list/:operatorId?",
                name: "commodity_list",
                component: () => import("../views/commodity/index.vue"),
                meta: {
                    name: "commodity_list",
                    text: "商品列表",
                },
            },
        ],
    },
    {
        path: "/orderControl",
        name: "orderControl",
        ico: "ni ni-box-2",
        component: () => import("../views/layout/childLayout/ChildLayout.vue"),
        meta: {
            name: "commodityControl",
            text: "訂單管理",
        },
        children: [
            {
                path: "orderControl_purchase_order_list/:operatorId?",
                name: "orderControl_purchase_order_list",
                component: () => import("../views/order/purchaseOrder/index.vue"),
                meta: {
                    name: "orderControl_purchase_order_list",
                    text: "進貨訂單",
                },
            },
            {
                path: "orderControl_purchase_order_data/:operatorId?/:orderNumber?",
                name: "orderControl_purchase_order_data",
                component: () => import("../views/order/purchaseOrder/Form.vue"),
                meta: {
                    name: "orderControl_purchase_order_data",
                    text: "進貨訂單明細",
                },
            },
            {
                path: "orderControl_point_order_list/:operatorId?",
                name: "orderControl_point_order_list",
                component: () => import("../views/order/pointOrder/index.vue"),
                meta: {
                    name: "orderControl_point_order_list",
                    text: "點數訂單",
                },
            },
            {
                path: "orderControl_operator_order_list/:operatorId?",
                name: "orderControl_operator_order_list",
                component: () => import("../views/order/operatorOrder/index.vue"),
                meta: {
                    name: "orderControl_operator_order_list",
                    text: "商家訂單",
                },
            },
            {
                path: "orderControl_operator_order_data/:operatorId?/:designerId?/:orderNumber?",
                name: "orderControl_operator_order_data",
                component: () => import("../views/order/operatorOrder/Form.vue"),
                meta: {
                    name: "orderControl_operator_order_data",
                    text: "商家訂單明細",
                },
            },
        ],
    },
    {
        path: "/accountControl",
        name: "accountControl",
        ico: "ni ni-single-02",
        component: () => import("../views/layout/childLayout/ChildLayout.vue"),
        meta: {
            name: "accountControl",
            text: "帳號管理",
        },
        children: [
            {
                path: "accountControl_system",
                name: "accountControl_system",
                component: () => import("../views/user/system/index.vue"),
                meta: {
                    name: "accountControl_system",
                    text: "系統",
                },
            },
            {
                path: "accountControl_operator",
                name: "accountControl_operator",
                component: () => import("../views/user/operator/index.vue"),
                meta: {
                    name: "accountControl_operator",
                    text: "店面",
                },
            },
            {
                path: "accountControl_designer/:id?",
                name: "accountControl_designer",
                component: () => import("../views/user/designer/index.vue"),
                meta: {
                    name: "accountControl_designer",
                    text: "設計師",
                },
            },
            {
                path: "accountControl_designer_panel/:account/:operatorId/:designerId",
                name: "accountControl_designer_panel",
                component: () => import("../views/user/designer/panel/index.vue"),
                meta: {
                    name: "accountControl_designer_panel",
                    text: "設計師控制台",
                },
            },
            {
                path: "accountControl_assistant/:id?",
                name: "accountControl_assistant",
                component: () => import("../views/user/assistant/index.vue"),
                meta: {
                    name: "accountControl_assistant",
                    text: "助理",
                },
            },
            {
                path: "accountControl_sub/:type?/:userId?/:operatorId?",
                name: "accountControl_sub",
                component: () => import("../views/user/sub/index.vue"),
                meta: {
                    name: "accountControl_sub",
                    text: "子帳號",
                },
            },
            {
                path: "accountControl_operator_permissionSet/:id/:groupCode/:isSub?",
                name: "accountControl_operator_permissionSet",
                component: () =>
                    import("../views/user/operator/PermissionSet.vue"),
                meta: {
                    name: "accountControl_operator_permissionSet",
                    text: "個人權限設定",
                },
            },
            {
                path: "accountControl_member/:operatorId?",
                name: "accountControl_member",
                component: () => import("../views/user/member/index.vue"),
                meta: {
                    name: "accountControl_member",
                    text: "會員",
                },
            },
            // {
            //     path: "accountControl_member",
            //     name: "accountControl_member",
            //     component: () => import("../views/user/member/index.vue"),
            //     meta: {
            //         name: "accountControl_member",
            //         text: "會員",
            //     },
            // },
        ],
    },
    // {
    //     path: "/noticeControl",
    //     name: "noticeControl",
    //     ico: "ni ni-air-baloon",
    //     component: () => import("../views/layout/childLayout/ChildLayout.vue"),
    //     meta: {
    //         name: "noticeControl",
    //         text: "通知管理",
    //     },
    //     children: [
    //         // {
    //         //     path: "noticeControl_all",
    //         //     name: "noticeControl_all",
    //         //     component: () => import("../views/notices/commodity/index.vue"),
    //         //     meta: {
    //         //         name: "noticeControl_all",
    //         //         text: "全部通知",
    //         //     },
    //         // },
    //         // {
    //         //     path: "noticeControl_commodity",
    //         //     name: "noticeControl_commodity",
    //         //     component: () => import("../views/notices/commodity/index.vue"),
    //         //     meta: {
    //         //         name: "noticeControl_commodity",
    //         //         text: "商品交易通知",
    //         //     },
    //         // },
    //     ],
    // },
    {
        path: "/reportControl",
        name: "reportControl",
        ico: "ni ni-chart-bar-32",
        component: () => import("../views/layout/childLayout/ChildLayout.vue"),
        meta: {
            name: "reportControl",
            text: "報表管理",
        },
        children: [
            {
                path: "reportControl_performance",
                name: "reportControl_performance",
                component: () => import("../views/report/performance/index.vue"),
                meta: {
                    name: "reportControl_performance",
                    text: "業績報表",
                },
            },
            {
                path: "reportControl_salary",
                name: "reportControl_salary",
                component: () => import("../views/report/salary/index.vue"),
                meta: {
                    name: "reportControl_salary",
                    text: "薪資報表",
                },
            },
            {
                path: "reportControl_total",
                name: "reportControl_total",
                component: () => import("../views/report/total/index.vue"),
                meta: {
                    name: "reportControl_total",
                    text: "總額報表",
                },
            },
            {
                path: "reportControl_purchase",
                name: "reportControl_purchase",
                component: () => import("../views/report/purchase/index.vue"),
                meta: {
                    name: "reportControl_purchase",
                    text: "進貨報表",
                },
            },
        ],
    },
    {
        path: "/otherControl",
        name: "otherControl",
        ico: "ni ni-shop",
        component: () => import("../views/layout/childLayout/ChildLayout.vue"),
        meta: {
            name: "otherControl",
            text: "其它管理",
        },
        children: [
            {
                path: "otherControl_salary/:operatorId?",
                name: "otherControl_salary",
                component: () => import("../views/salary/index.vue"),
                meta: {
                    name: "otherControl_salary",
                    text: "薪水",
                },
            },
        ],
    },
    // {
    //     path: "/transactionControl",
    //     name: "transactionControl",
    //     ico: "ni ni-money-coins",
    //     component: () => import("../views/layout/childLayout/ChildLayout.vue"),
    //     meta: {
    //         name: "transactionControl",
    //         text: "交易管理",
    //     },
    //     children: [
    //     ],
    // },
    // {
    //     path: "/recordControl",
    //     name: "recordControl",
    //     ico: "ni ni-bullet-list-67",
    //     component: () => import("../views/layout/childLayout/ChildLayout.vue"),
    //     meta: {
    //         name: "recordControl",
    //         text: "記錄管理",
    //     },
    //     children: [
    //     ],
    // },
];
export default dynamicRoutes;
