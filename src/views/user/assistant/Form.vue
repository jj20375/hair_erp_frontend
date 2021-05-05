<template>
    <el-dialog :title="`${submitText}助理`"
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
            <el-form-item label="使用個人權限">
                <el-switch v-model="form.open_user_permission"
                           active-text="是"
                           active-color="#13ce66"
                           :active-value="1"
                           :inactive-value="0"
                           inactive-text="否"
                           inactive-color="#ff4949"></el-switch>
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
            <el-form-item label="最低業績">
                <el-input v-model="form.limit"
                          placeholder="請輸入業績額度"></el-input>
                <p class="mb-0 gray-color">設定需多少業績可抽成</p>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="20">
                    <el-form-item>
                        <label class="d-block">助理圖片</label>
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
                <el-col v-if="imgUrl !== null"
                        :span="20">
                    <el-form-item>
                        <div>助理圖片</div>
                        <img class="rounded"
                             width="200"
                             :src="`${$gcsImgUrl}/${imgUrl}`">
                        <button @click.prevent="onDelete(form.assistant_id)"
                                class="btn btn-danger">刪除圖片</button>
                    </el-form-item>
                </el-col>
            </el-row>
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

<style lang="scss">
.zindex10000 {
    z-index: 10000;
}
</style>

<script>
import { mapState, mapGetters } from "vuex";
// 導入 sweetalert 套件
import Swal from "sweetalert2";
/**
 * AddAssistantApi = 新增助理api
 * UpdateAssistantApi = 更新助理api
 * AssistantUserDataApi = 取得助理資料api
 * DeleteAssistantImageApi = 刪除助理圖片api
 */
import { AddAssistantApi, UpdateAssistantApi, AssistantUserDataApi, DeleteAssistantImageApi } from "../../../api/assistantApi";
/**
 * 取得群組列表
 */
import { GroupSelectListApi } from "../../../api/groupApi";
export default {
    props: {
        // 外部組件 傳值開啟彈窗
        showDialog: {
            type: Boolean,
            default: false
        },
        // 判斷是否為更新
        checkEdit: {
            type: Boolean,
            default: false
        },
        // 取得表單資料使用帳號
        formAccount: {
            type: String
        },
        // 管理者id:
        operatorId: {
            type: [Number, String]
        }
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"]),
        // 用來判斷是要呈現更新還是新增的按鈕
        submitText() {
            let self = this;
            if (self.checkEdit) {
                return "更新";
            }
            return "新增";
        }
    },
    data() {
        // 判斷密碼確認是否輸入一樣
        return {
            // 表單資料
            form: {},
            // 選擇群組
            groupOptions: [],
            // 上傳檔案列表
            fileList: [],
            // 選取到的圖片檔
            photoFile: null,
            // 圖檔路徑
            imgUrl: null,
            // 選擇啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 }
            ],
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
                group_id: [
                    {
                        required: true,
                        message: "請選擇群組",
                        trigger: "change"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "請選擇狀態",
                        trigger: "change"
                    }
                ]
            }
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
            self.imgUrl = null;
            self.photoFile = null;
            self.fileList = [];
            self.$emit("onCloseDialog", false);
            self.$refs["form"].resetFields();
            self.$refs["form"].clearValidate();
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
         * 刪除助理圖片
         * @param { type String or Number (字串或數字) } assistantId 助理id
         */
        async onDelete(assistantId) {
            let self = this;
            try {
                let { value } = await Swal.fire({
                    title: "請問是否刪除?",
                    customClass: {
                        container: "zindex10000"
                    },
                    html: `刪除資料：${assistantId}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "刪除!",
                    cancelButtonText: "取消"
                });
                // 判斷是否點擊刪除
                if (value) {
                    try {
                        await DeleteAssistantImageApi(self.imgUrl, assistantId);
                        self.$message({
                            type: "success",
                            message: "刪除成功"
                        });
                        self.closeDialog();
                    } catch (err) {
                        self.$message({
                            type: "error",
                            message: "刪除失敗"
                        });
                    }
                }
            } catch (err) {}
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
                // 判斷是否有傳送新的圖檔
                if (self.photoFile !== null) {
                    self.form.imgFile = self.photoFile;
                }
                // 判斷是更新的話 執行更新方法
                if (self.checkEdit) {
                    self.update(self.form);
                    return;
                }
                /**
                 * 此判斷式目的在於判斷是否為系統 協助新增助理帳號
                 * 1. 如果網址上id 沒有參數值時 代表為管理者自行新增助理帳號
                 * 2. 如果網址上id 有參數值時 代表為系統使用者協助新增助理帳號
                 * ps. 管理者只能建立自己底下的助理帳號 不可幫分店管理者做建立助理帳號
                 */
                if (self.$route.params.id !== undefined) {
                    // 抓取網址id參數 當作管理者id
                    self.form.operator_id = self.$route.params.id;
                } else {
                    // 網址沒有參數時 抓取登入者的管理者id
                    self.form.operator_id = self.getOperatorId;
                }
                self.add(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗"
                });
            }
        },
        /**
         * 新增助理
         * @param { type Obejct(物件) } form 表單資料
         */
        async add(form) {
            let self = this;
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(form).map((objKey) => {
                result.append(objKey, form[objKey]);
            });
            try {
                await AddAssistantApi(result);
                self.$message({
                    type: "success",
                    message: "新增助理成功"
                });
                // 重取列表資料
                self.refreshData();
                // 關閉彈窗
                self.closeDialog();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "新增助理失敗"
                });
            }
        },
        /**
         * 更新助理
         * @param { type Obejct(物件) } form 表單資料
         */
        async update(form) {
            let self = this;
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(form).map((objKey) => {
                result.append(objKey, form[objKey]);
            });
            try {
                await UpdateAssistantApi(result);
                self.$message({
                    type: "success",
                    message: "更新助理成功"
                });
                // 重取列表資料
                self.refreshData();
                // 關閉彈窗
                self.closeDialog();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新助理失敗"
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
        async getGroupLists(groupCode, operatorId, isSub = false) {
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
         * 取得助理資料
         * @param { type String or Number(字串或數字) }assistantId 助理人員id
         */
        async getData(assistantId) {
            let self = this;
            try {
                let { data } = await AssistantUserDataApi(assistantId);
                self.form = {
                    operator_id: data.data.operator_id,
                    assistant_id: data.data.assistant_id,
                    open_user_permission: data.data.user.open_user_permission,
                    user_id: data.data.user.user_id,
                    account: data.data.account,
                    status: data.data.status,
                    group_id: data.data.user.group_id,
                    remarks: data.data.user.remarks,
                    name: data.data.name,
                    limit: data.data.limit
                };
                if (data.data.image !== null) {
                    self.imgUrl = data.data.image.img_path;
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取的資料失敗"
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
            if (self.checkEdit) {
                self.getGroupLists("ASSISTANT", self.operatorId);
                self.getData(self.formAccount);
                self.rules.password = [
                    {
                        required: false,
                        message: "請輸入密碼",
                        trigger: "blur"
                    }
                ];
                self.rules.passwordConfirm = [
                    {
                        required: false,
                        validator: self.formCheckPassRule
                    }
                ];
            } else {
                /**
                 * 此判斷式主要目的
                 * 1. 如果網址上沒有id 參數的話 代表新增人員為 非系統身份 因此抓取登入者管理者id 作為搜尋條件
                 * 2. 如果網址上有id 參數的話 代表此為系統人員操作 協助新增助理帳號 因此 抓取參數值為網址 id 參數
                 */
                let operatorId = self.$route.params.id === undefined ? self.getOperatorId : self.$route.params.id;
                self.getGroupLists("ASSISTANT", operatorId);
                self.rules.password = [
                    {
                        required: true,
                        message: "請輸入密碼",
                        trigger: "blur"
                    }
                ];
                self.rules.passwordConfirm = [
                    {
                        required: true,
                        validator: self.formCheckPassRule
                    }
                ];
            }
        }
    }
};
</script>