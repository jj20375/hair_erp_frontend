<template>
    <el-dialog :title="`${submitText}系統使用者`"
               :visible.sync="showDialog"
               :close-on-click-modal="true"
               :show-close="true"
               :modal-append-to-body="true"
               :close-on-press-escape="true"
               :before-close="closeDialog"
               @open="openDialog"
               @close="closeDialog"
               :width="isMobile ? '100%' : '50%'"
               center>
        <el-form :label-position="'right'"
                 :model="form"
                 status-icon
                 :rules="rules"
                 ref="form"
                 label-width="100px">
            <el-form-item label="帳號"
                          prop="account">
                <el-input v-model="form.account"
                          placeholder="請輸入帳號"
                          :disabled="checkEdit"></el-input>
            </el-form-item>
            <el-form-item label="密碼"
                          prop="password">
                <el-input type="password"
                          v-model="form.password"
                          autocomplete="off"></el-input>
                <span class="text-warning"
                      v-if="checkEdit">有需要更新再輸入</span>
            </el-form-item>
            <el-form-item label="請確認密碼"
                          prop="passwordConfirm">
                <el-input type="password"
                          v-model="form.passwordConfirm"
                          autocomplete="off"></el-input>
                <span class="text-warning"
                      v-if="checkEdit">有需要更新再輸入</span>
            </el-form-item>
            <el-form-item label="名稱"
                          prop="name">
                <el-input v-model="form.name"
                          placeholder="請輸入名稱"></el-input>
            </el-form-item>
            <el-form-item label="群組"
                          prop="group_id">
                <el-select v-model="form.group_id"
                           placeholder="請選擇群組">
                    <el-option v-for="item in groupOptions"
                               :key="item.group_id"
                               :label="item.group_name"
                               :value="item.group_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="狀態"
                          prop="status">
                <el-select v-model="form.status"
                           placeholder="請選擇狀態">
                    <el-option v-for="item in statusOptions"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="ip白名單"
                          v-if="user.group.group_code === 'SYSTEM'">
                <div class="btn btn-primary"
                     @click="addWhiteList()">新增輸入框</div>
                <div v-for="(item,index) in whiteListsTotal"
                     :key="item">
                    <el-input v-model.trim="whiteLists[index]"
                              placeholder="輸入ip白名單"></el-input>
                </div>
                <div>請設定此管理者可操作的ip白名單</div>
            </el-form-item>
            <el-form-item label="備註">
                <el-input v-model="form.remarks"
                          type="textarea"
                          placeholder="備註說明"></el-input>
            </el-form-item>
            <div class="text-right">
                <el-button type="primary"
                           @click="onSubmit('form')">{{ submitText }}</el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
// 導入 lodash 套件
import _ from "lodash";
/**
 * AddSystemApi = 新增系統人員api
 * UpdateSystemApi = 更新系統人員api
 * SystemUserDataApi = 取得系統人員資料api
 */
import { AddSystemApi, UpdateSystemApi, SystemUserDataApi } from "../../../api/systemApi";
/**
 * 取得群組列表
 */
import { GroupSelectListApi } from "../../../api/groupApi";
export default {
    props: {
        // 外部組件 傳值開啟彈窗
        showDialog: {
            type: Boolean,
            default: false,
        },
        // 判斷是否為更新
        checkEdit: {
            type: Boolean,
            default: false,
        },
        // 取得表單資料使用帳號
        formAccount: {
            type: String,
        },
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 用來判斷是要呈現更新還是新增的按鈕
        submitText() {
            let self = this;
            if (self.checkEdit) {
                return "更新";
            }
            return "新增";
        },
    },
    data() {
        // 判斷密碼確認是否輸入一樣
        return {
            // 表單資料
            form: {},
            // 選擇群組
            groupOptions: [],
            // 選擇啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 },
            ],
            // ip 白名單
            whiteLists: [],
            // ip 白名單數量
            whiteListsTotal: 1,
            // 驗證規則
            rules: {
                account: [
                    {
                        required: true,
                        message: "請輸入帳號",
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "請輸入名稱",
                        trigger: "blur",
                    },
                ],
                group_id: [
                    {
                        required: true,
                        message: "請選擇群組",
                        trigger: "change",
                    },
                ],
                status: [
                    {
                        required: true,
                        message: "請選擇狀態",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    methods: {
        // 判斷密碼是否有一樣
        formCheckPassRule(rule, value, callback) {
            let self = this;
            if (value === "") {
                callback(new Error("請再次輸入密碼"));
            } else if (value !== self.form.password) {
                callback(new Error("請確認兩次密碼輸入一致!"));
            } else {
                callback();
            }
        },
        // 關閉彈窗
        closeDialog() {
            let self = this;
            self.form = {};
            self.$refs["form"].resetFields();
            self.$refs["form"].clearValidate();
            self.$emit("onCloseDialog", false);
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            // 判斷表單驗證成功了 才執行註冊或更新
            try {
                // 等待表單驗證是否成功 try catch 會自動判斷是 true 或 false 因次不用寫 if 判斷
                await self.$refs[formName].validate();
                // 判斷有無ip白名單 且只有系統人員可以新增白名單
                if ( self.whiteLists.length > 0 && self.user.group.group_code === "SYSTEM") {
                    // 儲存以輸入的陣列值 並執行判斷是否有空字串 有空字串則刪除陣列中空字串索引
                    let arr = _.reject(self.whiteLists, _.isEmpty);
                    // 如果是空陣咧 則回傳 null 非空陣列則回傳陣列值
                    self.form.lists = arr.length <= 0 ? null : JSON.stringify(arr);
                }
                // 判斷是更新的話 執行更新方法
                if (self.checkEdit) {
                    self.update(self.form);
                    return;
                }
                self.add(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗",
                });
            }
        },
        /**
         * 新增系統使用者
         * @param { type Obejct(物件) } form 表單資料
         */
        async add(form) {
            let self = this;
            try {
                await AddSystemApi(form);
                self.$message({
                    type: "success",
                    message: "新增系統使用者成功",
                });
                // 重取列表資料
                self.refreshData();
                // 關閉彈窗
                self.closeDialog();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "新增系統使用者失敗",
                });
            }
        },
        /**
         * 更新系統使用者
         * @param { type Obejct(物件) } form 表單資料
         */
        async update(form) {
            let self = this;
            try {
                await UpdateSystemApi(form);
                self.$message({
                    type: "success",
                    message: "更新系統使用者成功",
                });
                // 重取列表資料
                self.refreshData();
                // 關閉彈窗
                self.closeDialog();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新系統使用者失敗",
                });
            }
        },
        /**
         * 取得群組列表
         * @param { type Object(物件) } data 分頁過濾參數(需對應資料庫表欄位名稱)
         * @example {
         * groupCode: 群組代碼,
         * operatorId: 管理者id
         * isSub: 是否為子帳號專用
         * }
         */
        async getGroupLists(groupCode, operatorId = 0, isSub = false) {
            let self = this;
            try {
                let { data } = await GroupSelectListApi(groupCode, operatorId, isSub);
                self.groupOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得群組列表失敗"
                });
            }
        },
        /**
         * 取得系統人員資料
         * @param { type String or Number(字串或數字) } account 系統人員帳號
         */
        async getData(account) {
            let self = this;
            try {
                let { data } = await SystemUserDataApi(account);
                // ip 白名單資料
                let whiteLists = data.data.white_lists;
                // 取得白名單數量
                self.whiteListsTotal = whiteLists === null ? 1 : JSON.parse(whiteLists.lists).length;
                // 設定白名單資料
                self.whiteLists = whiteLists === null ? [] : JSON.parse(whiteLists.lists);

                self.form = {
                    system_id: data.data.system_id,
                    user_id: data.data.user.user_id,
                    account: data.data.account,
                    status: data.data.status,
                    group_id: data.data.user.group_id,
                    remarks: data.data.user.remarks,
                    name: data.data.name,
                };
                // 判斷是否有ip白名單 且只有系統人員才可新增或更新
                if ( whiteLists !== null && self.user.group.group_code === "SYSTEM") {
                    self.$set(self.form, "ip_id", whiteLists.white_list_id);
                } else if (self.user.group.group_code === "SYSTEM") {
                    self.$set(self.form, "ip_id", 0);
                }

            } catch (err) {
                console.log(arr)
                self.$message({
                    type: "error",
                    message: "取得資料失敗",
                });
            }
        },
        // 重取列表資料
        refreshData() {
            let self = this;
            self.$emit("onRefreshData");
        },
        // 打開彈窗觸發事件
        openDialog() {
            let self = this;
            self.getGroupLists("SYSTEM");
            if(self.checkEdit) {
                self.getData(self.formAccount);
                self.rules.password = [
                    {
                        required: false,
                        message: "請輸入密碼",
                        trigger: "blur",
                    },
                ];
                self.rules.passwordConfirm = [
                    {
                        required: false,
                        validator: self.formCheckPassRule,
                    },
                ];
            } else {
                self.rules.password = [
                    {
                        required: true,
                        message: "請輸入密碼",
                        trigger: "blur",
                    },
                ];
                self.rules.passwordConfirm = [
                    {
                        required: true,
                        validator: self.formCheckPassRule,
                    },
                ];
            }
        },
    },
};
</script>