<template>
    <div>
        <el-dialog :title="showTitle"
                   :visible.sync="showDialog"
                   :close-on-click-modal="true"
                   :show-close="true"
                   :modal-append-to-body="true"
                   :close-on-press-escape="true"
                   :width="isMobile ? '100%' : '50%'"
                   :before-close="closeDialog"
                   @close="closeDialog"
                   center>
            <el-form :label-position="'left'"
                     ref="form"
                     label-width="150px"
                     :model="form"
                     :rules="rules">
                <el-form-item label="Class代碼">
                    <el-input v-model.trim="form.class"
                              @change="checkKeyName()"></el-input>
                </el-form-item>
                <el-form-item label="Func代碼">
                    <el-input v-model.trim="form.func"
                              @change="checkKeyName()"></el-input>
                </el-form-item>
                <el-form-item label="KeyName"
                              prop="key">
                    <el-input v-model.trim="form.key"
                              @change="checkKeyName('key')"></el-input>
                </el-form-item>
                <el-form-item label="名稱"
                              prop="str">
                    <el-input v-model.trim="form.str"></el-input>
                </el-form-item>
                <el-form-item label="選單使用">
                    <el-switch v-model="form.is_menu"
                               active-text="是"
                               active-color="#13ce66"
                               :active-value="1"
                               :inactive-value="0"
                               inactive-text="否"
                               inactive-color="#ff4949"></el-switch>
                </el-form-item>
                <el-form-item label="子項控制">
                    <el-switch v-model="form.is_option"
                               active-text="是"
                               active-color="#13ce66"
                               :active-value="1"
                               :inactive-value="0"
                               inactive-text="否"
                               inactive-color="#ff4949"></el-switch>
                </el-form-item>
                <el-form-item label="指定路由KEY">
                    <el-input v-model.trim="form.custom_key"
                              placeholder="留空為目前的keyName值對應"></el-input>
                    <div>需要特別指定共用時使用。不需要請留空</div>
                </el-form-item>
                <el-form-item label="設定子項功能">
                    <button @click.prevent="addRow()"
                            class="hotBtn borderRadius10">新增欄位</button>
                    <div v-for="(item,index) in options"
                         :key="index"
                         class="borderBottomWidth2 grayBorder mb-2">
                        <label class="mb-0">對應key</label>
                        <el-input v-model="options[index].key"
                                  placeholder="留空為目前的keyName值對應"></el-input>
                        <label class="mb-0">對應名稱</label>
                        <el-input v-model="options[index].name"
                                  placeholder="留空為目前的keyName值對應"></el-input>
                        <button class="btn btn-danger"
                                @click="deleteRow(index)">刪除行</button>
                    </div>
                    <div>有子項功能時才設定，有幾個則設定幾個就好</div>
                </el-form-item>
                <!-- <el-form-item label="對應路由">
                    <el-checkbox-group v-model="routeCRUD">
                        <el-checkbox-button v-for="(item,index) in routeCRUDOption"
                                            :label="item.value"
                                            :key="index">
                            {{item.label}}
                        </el-checkbox-button>
                    </el-checkbox-group>
                    <span class="grayBorder gray-color borderWidth1 borderRadius10 p-1">額外對應權限的控制路由功能</span>
                </el-form-item> -->
                <el-form-item label="群組權限">
                    <el-checkbox-group v-model="perChecked">
                        <el-checkbox-button v-for="(item,key) in permissionRuleOption"
                                            :label="item"
                                            :key="key">
                            {{key | showRoleGroupName}}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           native-type="submit"
                           @click.prevent="onSubmit('form')">確定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/**
 * AddPermissionRouteDataApi = 新增權限或選單路由資料
 * UpdatePermissionRouteDataApi = 更新權限或選單路由資料
 * PermissionRouteDetailApi = 取得路由權限詳細資料
 */
import {
    AddPermissionRouteDataApi,
    UpdatePermissionRouteDataApi,
    PermissionRouteDetailApi,
} from "../../api/permissionApi";
import _ from "lodash";
export default {
    props: {
        showDialog: {
            type: Boolean,
        },
        // 判斷是新增或修改
        checkEdit: {
            type: Boolean,
        },
        // 權限路由上層 id
        parentId: {
            type: [Number, String],
        },
        // 更新時表單資料
        formId: {
            type: [Number, String],
            default: null,
        },
        // 選擇群組身份
        permissionRuleOption: {
            type: Object,
        },
    },
    filters: {
        // 呈現群組身份名稱(有語系檔時可刪除)
        showRoleGroupName(val) {
            let keyName = {
                SYSTEM: "系統",
                OPERATOR: "管理者",
                DESIGNER: "設計師",
                ASSISTANT: "助理",
                MEMBER: "會員",
            };
            return keyName[val];
        },
    },
    computed: {
        // 判斷彈窗標題 要呈現內容
        showTitle() {
            let self = this;
            let message = "";
            if (self.checkEdit) {
                message = "編輯路由";
                return message;
            }
            if (self.parentId === 0) {
                message = "新增最上層路由";
                return message;
            }
            message = "新增子路由";
            return message;
        },
    },
    data() {
        let self = this;
        return {
            // 表單資料
            form: {},
            /**
             * 預設權限子功能
             * 假設預設權限 中 管理者頁面路由中 有需要設定 管理者個人權限的子功能 此子功能儲存在此陣列中
             */
            options: [],
            // 選中群組身份 key
            perChecked: [],
            // 表單驗證規則
            rules: {
                key: [
                    {
                        required: true,
                        message: "請輸入Key代碼",
                        trigger: "blur",
                    },
                ],
                str: [
                    {
                        required: true,
                        message: "請輸入名稱",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        // 新增欄位
        addRow() {
            let self = this;
            self.options.push({ name: null, key: null });
        },
        // 刪除多餘的進貨明細欄位
        deleteRow(index) {
            let self = this;
            self.options.splice(index, 1);
        },
        //對應keyName
        checkKeyName(cKey) {
            let self = this;
            if (cKey == "key") {
                let keyName = self.form.key;
                // 過濾掉底線字串 且過濾完後 會變成 陣列值
                let arr = keyName.split("_"); // 輸出值為陣列
                // class的 值為 第一個陣列值資料 參考資料 可參考 dynamicRouter.js 檔案 簡單來說就是 路由的 name 名稱 用 底線當命名規則
                self.$set(self.form, "class", arr[0]);
                // 判斷如果有輸入 底線的 命名規則時
                if (arr[1]) {
                    // 命名名稱
                    let func = "";
                    // 如果有 大於 一個 底線的 命名規則時 跑回圈 組合 命名名稱
                    for (let i = 1; i < arr.length; i++) {
                        // 且不能加入 arr[0] 的字串
                        func += (i == 1 ? "" : "_") + arr[i];
                    }
                    self.$set(self.form, "func", func);
                } else {
                    self.$set(self.form, "func", "");
                }
            } else {
                // key 等於 class+func 組合後的字串
                let key =
                    self.form.class +
                    (self.form.func ? `_${self.form.func}` : "");
                self.$set(self.form, "key", key);
            }
        },
        // 關閉彈窗事件
        closeDialog() {
            let self = this;
            self.form = {};
            self.$emit("onCloseDialog");
            // 關閉彈窗時清空驗證規則
            self.$refs.form.clearValidate(["key", "str"]);
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            try {
                await self.$refs[formName].validate();
                if (self.checkEdit) {
                    self.update();
                    return;
                }
                self.add();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗",
                });
            }
        },
        // 新增權限或選單路由資料
        async add() {
            let self = this;
            // 可查看此路由群組身份
            self.form.permission_rule = _.sum(self.perChecked);
            // 上層路由 id
            self.form.parent_id = self.parentId;
            // 判斷有無子項功能
            if (self.options.length > 0) {
                // 儲存以輸入的陣列值 並執行判斷是否有空字串 有空字串則刪除陣列中空字串索引
                let arr = _.reject(self.options, _.isEmpty);
                // 如果是空陣咧 則回傳 null 非空陣列則回傳陣列值
                self.form.have_options =
                    arr.length <= 0 ? null : JSON.stringify(arr);
            } else {
                self.form.have_options = null;
            }
            try {
                await AddPermissionRouteDataApi(self.form);
                self.$message({
                    type: "success",
                    message: "新增成功",
                });
                // 關閉彈窗
                self.closeDialog();
                // 重取列表
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "新增失敗",
                });
            }
        },
        // 更新 權限或選單路由
        async update() {
            let self = this;
            // 判斷有無子項功能
            if (self.options.length > 0) {
                // 儲存以輸入的陣列值 並執行判斷是否有空字串 有空字串則刪除陣列中空字串索引
                let arr = _.reject(self.options, _.isEmpty);
                // 如果是空陣咧 則回傳 null 非空陣列則回傳陣列值
                self.form.have_options = arr.length <= 0 ? null : arr;
            } else {
                self.form.have_options = null;
            }

            // 可查看此路由群組身份
            self.form.permission_rule = _.sum(self.perChecked);
            try {
                await UpdatePermissionRouteDataApi(self.form);
                self.$message({
                    type: "success",
                    message: "更新成功",
                });
                // 關閉彈窗
                self.closeDialog();
                // 重取列表
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新失敗",
                });
            }
        },
        // 新增或更新完後刷新table的內容
        refresh() {
            let self = this;
            self.$emit("onRefresh");
        },
        // 取得詳細資料
        async getDetail() {
            let self = this;
            try {
                let { data } = await PermissionRouteDetailApi(self.formId);
                // 設定 表單資料
                self.setFormData(data.data.permissionDefault);
                // 設定 選中的群組身份
                self.perChecked = data.data.selectPermissionRule;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得詳細資料失敗",
                });
            }
        },
        /**
         * 設定表單資料
         * @param { type Object(物件) } data 表單資料
         */
        setFormData(data) {
            let self = this;
            // 判斷有無子項功能
            if (data.have_options !== null) {
                self.options = JSON.parse(data.have_options);
            }
            self.form = {
                id: data.id,
                // vue路由前綴 ex: testControl_page1 (testControl為前綴)
                class: data.class,
                // vue路由後綴 ex: testControl_page1 (page1為後綴)
                func: data.func,
                // 路由前綴加後綴 ex: testControl_page1 (testControl_page1 為 keyName)
                key: data.key,
                // 路由名稱
                str: data.str,
                // 判斷此路由是否給選單用
                is_menu: data.is_menu,
                // 判斷是否為子項功能
                is_option: data.is_option,
                // 自訂義化 vue route name key
                custom_key: data.custom_key,
                // 佔無用處
                route_set: data.route_set,
            };
        },
    },
    created() {
        let self = this;
        if (self.checkEdit) {
            self.getDetail();
        }
    },
};
</script>
