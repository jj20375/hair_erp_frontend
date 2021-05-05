<template>
    <div>
        <div>
            <button class="darkBtn borderRadius10 px-3 py-2"
                    @click="clickDialog()"><i class="fas fa-plus mr-1"></i>新增最上層路由
            </button>
        </div>
        <hr />
        <div class="treeBox"
             v-loading="loading">
            <el-tree :data="datas"
                     node-key="id"
                     default-expand-all
                     :expand-on-click-node="false">
                <div class="custom-tree-node"
                     slot-scope="{ data }">
                    <div>{{data.str}}({{ data.key }})</div>
                    <div>
                        <el-button type="text"
                                   icon=""
                                   @click="clickDialog(data, true)">
                            <i class="fas fa-plus"></i>加入子路由
                        </el-button>
                        <el-button type="text"
                                   @click="onEdit(data)">
                            <i class="fas fa-comment-edit"></i>更新
                        </el-button>
                        <el-button type="text"
                                   @click="onDelete(data)">
                            <i class="fas fa-trash-alt"></i>刪除
                        </el-button>
                    </div>
                </div>
            </el-tree>
        </div>
        <Form v-if="showDialog"
              :showDialog="showDialog"
              :checkEdit="checkEdit"
              :parentId="parentId"
              :formId="formId"
              :permissionRuleOption="permissionRuleOption"
              @onRefresh="getPermissionRouteList"
              @onCloseDialog="closeDialog" />
    </div>

</template>
<script>
import Swal from "sweetalert2";
// 新增功能或選單路由 彈窗
import Form from "./Form.vue";
/**
 * PermissionRouteTreeListApi = 取得權限或選單路由樹狀列表
 * DeletePermissionRouteDataApi = 刪除權限或選單路由
 */
import { PermissionRouteTreeListApi, DeletePermissionRouteDataApi } from "../../api/permissionApi";
export default {
    components: {
        Form,
    },
    data() {
        return {
            // 是否顯示彈窗
            showDialog: false,
            // 判斷是否為更新
            checkEdit: false,
            // 表單Id
            formId: null,
            // 權限資料
            datas: [],
            // 新增權限路由 上層 id 如果傳 0 代表最上層
            parentId: 0,
            // 選擇群組身份
            permissionRuleOption: {},
            loading: false,
        };
    },
    methods: {
        /**
         * 新增功能 或選單路由 彈窗
         * @param { type Object(物件) } data 路由資料
         * @param { type Boolean(布林值) } isSub 判斷是否為子權限路由
         */
        clickDialog(data, isSub = false) {
            let self = this;
            self.showDialog = true;
            self.checkEdit = false;
            // 新增路由傳入上層 id 最上層路由傳入 0
            self.parentId = 0;
            // 如果是子路由時 更改上層id
            if (isSub) {
                self.parentId = data.id;
            }
        },
        /**
         * 更新選單 或子選單路由 彈窗
         * @param { type Object(物件) } data 選中的路由資料
         */
        onEdit(data) {
            let self = this;
            self.showDialog = true;
            self.checkEdit = true;
            // 取得詳細資料 id
            self.formId = data.id;
        },
        // 關閉彈窗
        closeDialog() {
            let self = this;
            self.checkEdit = false;
            self.showDialog = false;
        },
        /**
        * 刪除路由
        * @param { type Object(物件) } data 選中的路由資料
        */
        async onDelete(data) {
            let self = this;
            // 計算總共幾個子路由
            let subNum = data.children.length;
            try {
                let { value } = await Swal.fire({
                    title: "請問是否刪除?",
                    html: "刪除資料：" + data.str + "(" + data.key + ")" + "<br>" + (subNum > 0 ? "(注意：此有包含" + subNum + "個子節點，會被連帶刪除)" : ""),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "刪除!",
                    cancelButtonText: "取消",
                });
                // 判斷是否點擊刪除
                if (value) {
                    try {
                        await DeletePermissionRouteDataApi(data.id);
                        self.$message({
                            type: "success",
                            message: "刪除成功",
                        });
                        self.getPermissionRouteList();
                    } catch (err) {
                        self.$message({
                            type: "error",
                            message: "刪除失敗",
                        });
                    }
                }
            } catch (err) {}
        },

        // 取得路由樹狀列表
        async getPermissionRouteList() {
            let self = this;
            try {
                let { data } = await PermissionRouteTreeListApi();
                self.datas = data.data.permissionDefault;
                self.permissionRuleOption = data.data.permissionRule;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得路由樹狀列表失敗",
                });
            }
        },
    },
    created() {
        let self = this;
        self.getPermissionRouteList();
    },
};
</script>
<style  lang="scss" scoped>
/deep/ .el-tree-node__content {
    height: 50px;
}
.custom-tree-node {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    padding-right: 8px;
}
.treeBox {
    width: 80%;
    margin: 0 auto;
    border: 1px solid #c6c6c6;
    padding: 15px;
    border-radius: 15px;
}
</style>
