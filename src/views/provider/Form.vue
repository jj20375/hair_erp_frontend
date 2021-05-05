<template>
    <div>
        <el-dialog :visible.sync="showDialog"
                   :close-on-click-modal="true"
                   :show-close="true"
                   :modal-append-to-body="true"
                   :close-on-press-escape="true"
                   :before-close="closeDialog"
                   @open="openDialog"
                   :width="isMobile ? '100%' : '50%'"
                   center>
            <el-form :label-position="'left'"
                     ref="form"
                     label-width="120px"
                     :model="form"
                     :rules="rules">
                <el-form-item label="廠商名稱"
                              prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="廠商代碼"
                              prop="key">
                    <el-input v-model="form.key"></el-input>
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
                <el-form-item label="詳細資料">
                    <el-input type="textarea"
                              placeholder="請輸入內容"
                              v-model="form.note"
                              maxlength="30"
                              show-word-limit>
                    </el-input>
                </el-form-item>
                <el-row :gutter="10">
                    <el-col :span="20">
                        <el-form-item>
                            <label class="d-block">廠商圖片</label>
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
                            <div>廠商圖片</div>
                            <img class="rounded"
                                 width="200"
                                 :src="`${$gcsImgUrl}/${imgUrl}`">
                            <button @click.prevent="onDelete(form.provider_id)"
                                    class="btn btn-danger">刪除圖片</button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="w-100">
                <TreeSelect :treeData="treeData"
                            :defaultCheckedKeys="defaultCheckedKeys"
                            @onSelected="selectedOperators" />
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <el-button type="primary"
                           @click="onSubmit('form')">確定</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="scss">
.zindex10000 {
    z-index: 10000;
}
</style>
<script>
import { mapState, mapGetters } from "vuex";
// 導入 lodash套件
import _ from "lodash";
// 導入 sweetalert 套件
import Swal from "sweetalert2";
/**
 * AddProviderApi = 新增廠商 api
 * UpdateProviderApi = 更新廠商 api
 * ProviderDataApi = 取的廠商資料 api
 * DeleteProviderImageApi = 刪除廠商圖片api
 */
import { AddProviderApi, UpdateProviderApi, ProviderDataApi, DeleteProviderImageApi } from "../../api/providerApi";
// 樹狀選取框
import TreeSelect from "../components/MyTreeSelect.vue";
// 樹狀選擇框 設定檔
import treeSelectMixin from "../../service/treeSelectMixin";
export default {
    components: {
        TreeSelect
    },
    mixins: [treeSelectMixin],
    props: {
        showDialog: {
            type: Boolean
        },
        // 取得更新資料傳送id參數
        formId: {
            type: [String, Number]
        },
        // 判斷是否為更新
        checkEdit: {
            type: Boolean
        },
        // 管理者id:
        operatorId: {
            type: [Number, String]
        }
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            form: {},
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
                name: [
                    {
                        required: true,
                        message: "請輸入廠商名稱",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 30,
                        message: "長度最少2個字最多30個字",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "請選擇狀態",
                        trigger: "change"
                    },
                ],
                key: [
                    {
                        required: true,
                        message: "請選擇廠商代碼",
                        trigger: "change"
                    },
                    {
                        min: 2,
                        max: 30,
                        message: "長度最少2個字最多30個字",
                        trigger: "blur"
                    }
                ]
            },
            // 可使用的管理者id
            defaultCheckedKeys: []
        };
    },
    methods: {
        closeDialog() {
            let self = this;
            self.form = {};
            self.imgUrl = null;
            self.photoFile = null;
            self.fileList = [];
            self.defaultCheckedKeys = [];
            self.$emit("onCloseDialog");
            self.$refs.form.resetFields();
        },
        // 新增廠商
        async add(form) {
            let self = this;
            if (self.$route.params.operatorId === undefined) {
                form.operator_id = self.getOperatorId;
            } else {
                form.operator_id = self.$route.params.operatorId;
            }
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(form).map((objKey) => {
                result.append(objKey, form[objKey]);
            });
            try {
                await AddProviderApi(result);
                self.$message({
                    type: "success",
                    message: "新增成功"
                });
                // 關閉彈窗
                self.closeDialog();
                // 重新取得資料
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "新增失敗"
                });
            }
        },
        // 更新廠商
        async update(form) {
            let self = this;
            form.operator_id = self.operatorId;
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(form).map((objKey) => {
                result.append(objKey, form[objKey]);
            });
            try {
                await UpdateProviderApi(result);
                self.$message({
                    type: "success",
                    message: "更新成功"
                });
                // 關閉彈窗
                self.closeDialog();
                // 重新取得資料
                self.refresh();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新失敗"
                });
            }
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
         * @param { type String or Number (字串或數字) } providerId 廠商id
         */
        async onDelete(providerId) {
            let self = this;
            try {
                let { value } = await Swal.fire({
                    title: "請問是否刪除?",
                    customClass: {
                        container: "zindex10000"
                    },
                    html: `刪除資料：${providerId}`,
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
                        await DeleteProviderImageApi(self.imgUrl, providerId);
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
        async onSubmit(formName) {
            let self = this;
            try {
                await self.$refs[formName].validate();
                // 判斷是否有傳送新的圖檔
                if (self.photoFile !== null) {
                    self.form.imgFile = self.photoFile;
                }
                if (self.form.operator_ids === null) {
                    self.form.operator_ids = JSON.stringify([]);
                }
                // 判斷是否為更新
                if (self.checkEdit) {
                    self.form.provider_id = self.formId;
                    self.update(self.form);
                    return;
                }
                self.add(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗"
                });
            }
        },
        // 重新取得資料
        refresh() {
            let self = this;
            self.$emit("onRefresh");
        },
        /**
         * 取得廠商單一資料
         * @param { type String or Number(字串或數字) } providerId 廠商id
         */
        async getData(providerId) {
            let self = this;
            try {
                let { data } = await ProviderDataApi(providerId);
                self.form = data.data;
                // 選中的管理者id
                self.defaultCheckedKeys = data.data.operator_ids === null ? [] : JSON.parse(data.data.operator_ids);
                if (data.data.image !== null) {
                    self.imgUrl = data.data.image.img_path;
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得詳細資料失敗"
                });
            }
        },
        // 選擇到的管理者 id
        selectedOperators(val) {
            let self = this;
            self.form.operator_ids = JSON.stringify(val);
        },
        openDialog() {
            let self = this;
            // 判斷是否更新
            if (self.checkEdit) {
                self.getData(self.formId);
            }
            // 取得下層管理者樹狀資料
            self.getOperatorTreeLists(self.getOperatorId);
        }
    }
};
</script>
