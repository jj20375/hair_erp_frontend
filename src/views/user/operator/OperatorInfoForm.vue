<template>
    <el-dialog :title="'更新管理者'"
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
                          :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="密碼"
                          prop="password">
                <el-input type="password"
                          v-model="form.password"
                          autocomplete="off"></el-input>
                <span class="text-warning"
                      v-if="true">有需要更新再輸入</span>
            </el-form-item>
            <el-form-item label="請確認密碼"
                          prop="passwordConfirm">
                <el-input type="password"
                          v-model="form.passwordConfirm"
                          autocomplete="off"></el-input>
                <span class="text-warning"
                      v-if="true">有需要更新再輸入</span>
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
                    <el-option v-for="(item,index) in groupOptions"
                               :key="index"
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
            <el-form-item label="使用個人權限">
                <el-switch v-model="form.open_user_permission"
                           active-text="是"
                           active-color="#13ce66"
                           :active-value="1"
                           :inactive-value="0"
                           inactive-text="否"
                           inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="網址"
                          prop="domain">
                <div class="row m-0">
                    <div class="col-md-3 m-0 p-0">
                        <el-select v-model="form.http_type"
                                   placeholder="http或https">
                            <el-option v-for="(item,index) in ['http', 'https']"
                                       :key="index"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="col-md-6 m-0 p-0">
                        <el-input v-model="form.domain"
                                  placeholder="請輸入網址"></el-input>
                    </div>
                    <div class="col-md-3 m-0 p-0">
                        <el-input v-model="form.port"
                                  placeholder="如有需要port在輸入"></el-input>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="網站名稱"
                          prop="web_name">
                <el-input v-model="form.web_name"
                          placeholder="請輸入網站名稱"></el-input>
            </el-form-item>
            <el-form-item label="選擇樣版"
                          prop="template">
                <el-radio-group v-model="form.template_id">
                    <el-radio v-for="(item, index) in templateOptions"
                              :key="index"
                              :label="item.template_id">
                        <el-image v-if="item.img_path !== null"
                                  style="width: 100px; height: 100px"
                                  :src="`${$gcsImgUrl}/${item.img_path}`"
                                  :preview-src-list="[`${$gcsImgUrl}/${item.img_path}`]">
                        </el-image>
                        <span v-else>{{item.name}}</span>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="20">
                    <el-form-item>
                        <label class="d-block">Logo圖片</label>
                        <el-upload ref="upload"
                                   list-type="picture"
                                   :on-change="handleChange"
                                   :on-remove="handleRemove"
                                   :file-list="fileList"
                                   :auto-upload="false"
                                   :limit="1"
                                   drag
                                   action=""
                                   class="w-100"
                                   :on-exceed="imageOverLimit"
                                   accept="image/*">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">將圖片拖移上傳或<em>點擊上傳</em></div>
                            <div slot="tip"
                                 class="el-upload__tip">只能上傳jpg/png/gif文件，且不超過1.5mb</div>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col v-if="logoImgUrl !== null"
                        :span="20">
                    <el-form-item>
                        <div>目前LOGO</div>
                        <img class="rounded"
                             width="200"
                             :src="`${$gcsImgUrl}/${logoImgUrl}`">
                    </el-form-item>
                </el-col>
            </el-row>
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
                <el-input type="textarea"
                          v-model="form.remarks"
                          placeholder="備註說明"></el-input>
            </el-form-item>
            <div class="text-right">
                <el-button type="primary"
                           @click="onSubmit('form')">更新</el-button>
                <el-button @click="closeDialog()">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
/*
 * OperatorUserDataApi = 取得管理者資料
 * UpdateOperatorApi = 更新管理者
 */
import { OperatorUserDataApi, UpdateOperatorApi } from "../../../api/operatorApi";
// 取得群組列表
import { GroupSelectListApi } from "../../../api/groupApi";
//表
import { TemplateSelectListApi } from "../../../api/templateApi";
export default {
    props: {
        // 外部組件 傳值開啟彈窗
        showDialog: {
            type: Boolean,
            default: false
        },
        // 管理者 id
        operatorId: {
            type: Number,
            required: true
        },
        // 當前層級管理者 id
        currentOperatorId: {
            type: Number,
            required: true
        },
        // 取得表單資料使用帳號
        formAccount: {
            type: String
        }
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            loading: false,
            loading2: false,
            // 表單資料
            form: {},
            // 上傳檔案列表
            fileList: [],
            // 選取到的圖片檔
            photoFile: null,
            // logo圖檔 路徑
            logoImgUrl: null,
            // 選擇群組
            groupOptions: [],
            // 選擇樣板
            templateOptions: [],
            // 下拉選單選取啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 }
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
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "請輸入名稱",
                        trigger: "blur"
                    }
                ],
                domain: [
                    {
                        required: true,
                        message: "請輸入網址",
                        trigger: "blur"
                    }
                ],
                http_type: [
                    {
                        required: true,
                        message: "請選擇http或https",
                        trigger: "change"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "請選擇管理者狀態",
                        trigger: "change"
                    }
                ],
                group_id: [
                    {
                        required: true,
                        message: "請選擇群組",
                        trigger: "change"
                    }
                ],
                template_id: [
                    {
                        required: true,
                        message: "請選擇樣板",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        // 判斷密碼確認是否輸入一樣
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
            self.fileList = [];
            self.photoFile = null;
            self.logoImgUrl = null;
            self.$emit("onCloseDialog", false);
        },
        //圖片變更
        handleChange(file, fileList) {
            let self = this;
            if (file.size > 1500000) {
                self.fileList = [];
                self.$message({
                    type: "error",
                    message: "圖片尺寸過大"
                });
                return;
            }
            self.photoFile = file.raw;
        },
        //移除圖片
        handleRemove(file, fileList) {
            let self = this;
            self.photoFile = null;
        },
        //上傳圖片超過限制數量
        imageOverLimit(files, fileList) {
            let self = this;
            self.$message({
                type: "error",
                message: "超過上傳圖片上限"
            });
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            // 判斷是否有傳送新的logo 圖檔
            if (self.photoFile !== null) {
                self.form.logo = self.photoFile;
            }
            // 判斷有無ip白名單 且只有系統人員可以新增白名單
            if (self.whiteLists.length > 0 && self.user.group.group_code === "SYSTEM") {
                // 儲存以輸入的陣列值 並執行判斷是否有空字串 有空字串則刪除陣列中空字串索引
                let arr = _.reject(self.whiteLists, _.isEmpty);
                // 如果是空陣咧 則回傳 null 非空陣列則回傳陣列值
                self.form.lists = arr.length <= 0 ? null : JSON.stringify(arr);
            }
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(self.form).map((objKey) => {
                result.append(objKey, self.form[objKey]);
            });
            // 判斷表單驗證成功了 才執行註冊
            try {
                // 等待表單驗證是否成功 try catch 會自動判斷是 true 或 false 因次不用寫 if 判斷
                await self.$refs[formName].validate();
                self.update(result);
                // self.update(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗"
                });
            }
        },
        /**
         * 更新管理者
         * @param { type Object(物件) } form 表單資料
         */
        async update(form) {
            let self = this;
            try {
                await UpdateOperatorApi(form);
                self.$message({
                    type: "success",
                    message: "更新管理者成功"
                });
                self.closeDialog();
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新管理者失敗"
                });
            }
        },
        /**
         * 取得管理者資料
         * @param { type Number or String(字串或數字) } account 管理者帳號
         */
        async getData(account) {
            let self = this;
            try {
                let { data } = await OperatorUserDataApi(account);
                // 管理者基本資料
                let operatorData = data.data;
                // 管理者詳細資料
                let operatorInfoData = data.data.user_operator_info;
                // 管理者關聯user表資料
                let operatorUserData = data.data.user;
                // ip 白名單資料
                let whiteLists = data.data.white_lists;
                // 取得白名單數量
                self.whiteListsTotal = whiteLists === null ? 1 : JSON.parse(whiteLists.lists).length;
                // 設定白名單資料
                self.whiteLists = whiteLists === null ? [] : JSON.parse(whiteLists.lists);
                self.form = {
                    operator_id: operatorData.operator_id,
                    user_id: operatorUserData.user_id,
                    account: operatorData.account,
                    group_id: operatorUserData.group.group_id,
                    name: operatorData.name,
                    status: operatorData.status,
                    remarks: operatorUserData.remarks,
                    open_user_permission: operatorUserData.open_user_permission
                };
                // 判斷是否有輸入管理者詳細資料
                if (operatorInfoData !== null) {
                    // userOperatorInfo 表欄位 key
                    let keys = ["domain", "http_type", "port", "template_id", "web_name"];
                    keys.forEach((item) => {
                        self.$set(self.form, item, operatorInfoData[item]);
                    });
                    self.logoImgUrl = operatorInfoData.logo;
                }
                // 判斷是否有ip白名單 且只有系統人員才可新增或更新
                if (whiteLists !== null && self.user.group.group_code === "SYSTEM") {
                    self.$set(self.form, "ip_id", whiteLists.white_list_id);
                } else if (self.user.group.group_code === "SYSTEM") {
                    self.$set(self.form, "ip_id", 0);
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得管理者資料失敗"
                });
            }
        },
        /**
         * 取得群組列表
         * @param { type String(字串) } groupCode 群組代碼
         */
        async getGroupLists(groupCode) {
            let self = this;
            // 用來發送取的群組列表的管理者id
            let sendGroupOperatorId = null;
            // 判斷是否為系統
            if (self.user.group.group_code === "SYSTEM") {
                // 如果為系統使用者時 回傳選擇到的管理者id
                sendGroupOperatorId = self.operatorId;
            } else {
                // 如果為管理者時 回傳登入管理者的管理者id
                sendGroupOperatorId = self.getOperatorId;
            }
            try {
                let { data } = await GroupSelectListApi(groupCode, sendGroupOperatorId);
                self.groupOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得群組列表失敗"
                });
            }
        },
        /**
         * 取得樣板列表
         * @param { type String or Number(字串或數字) } operatorId
         */
        async getTemplateLists(operatorId) {
            let self = this;
            try {
                let { data } = await TemplateSelectListApi(operatorId);
                self.templateOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取的樣板列表失敗"
                });
            }
        },
        // 打開彈窗觸發事件
        openDialog() {
            let self = this;
            self.getGroupLists("OPERATOR");
            self.getData(self.formAccount);
        },
        // 重置管理者資料
        refresh() {
            let self = this;
            self.$emit("onRefresh", self.currentOperatorId);
        },
        // 新增ip白名單輸入匡
        addWhiteList() {
            let self = this;
            self.whiteListsTotal += 1;
        }
    },
    created() {
        let self = this;
        self.getGroupLists("OPERATOR");
        self.getTemplateLists(self.operatorId);
        self.getData(self.formAccount);
    }
};
</script>