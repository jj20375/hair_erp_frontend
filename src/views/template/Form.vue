<template>
    <el-dialog :visible.sync="showDialog"
               :close-on-click-modal="true"
               :show-close="true"
               :modal-append-to-body="true"
               :close-on-press-escape="true"
               :before-close="closeDialog"
               :width="isMobile ? '100%' : '50%'"
               center>
        <el-form :label-position="'left'"
                 ref="form"
                 label-width="150px"
                 :model="form"
                 :rules="rules">
            <el-form-item label="樣板名稱"
                          prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="樣板代碼"
                          prop="tmp_code">
                <el-input v-model="form.tmp_code"></el-input>
            </el-form-item>
            <el-form-item label="是否為共用樣板"
                          prop="public">
                <el-switch v-model="form.public"
                           active-text="是"
                           active-color="#13ce66"
                           :active-value="1"
                           :inactive-value="0"
                           inactive-text="否"
                           inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="是否啟用樣板"
                          prop="active">
                <el-switch v-model="form.active"
                           active-text="是"
                           active-color="#13ce66"
                           :active-value="1"
                           :inactive-value="0"
                           inactive-text="否"
                           inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="20">
                    <el-form-item>
                        <label class="d-block">樣板圖片</label>
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
                <el-col v-if="tmpImg !== null"
                        :span="20">
                    <el-form-item>
                        <div>目前樣板圖片</div>
                        <img class="rounded"
                             width="200"
                             :src="`${$gcsImgUrl}/${tmpImg}`">
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
</template>
<script>
import { mapState, mapGetters } from "vuex";
/**
 * AddTemplateApi = 新增樣板
 * UpdateTemplateApi = 更新樣板
 * TemplateDetailApi = 取的樣板資料
 */
import { AddTemplateApi, UpdateTemplateApi, TemplateDetailApi } from "../../api/templateApi";
// 樹狀選取框
import TreeSelect from "../components/MyTreeSelect.vue";
// 樹狀選擇框 設定檔
import treeSelectMixin from "../../service/treeSelectMixin";
export default {
    components: {
        TreeSelect
    },
    mixins: [treeSelectMixin],
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
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
        }
    },
    data() {
        return {
            form: {},
            // 樣板圖片
            tmpImg: null,
            // 上傳檔案列表
            fileList: [],
            // 選取到的圖片檔
            photoFile: null,
            rules: {
                name: [
                    {
                        required: true,
                        message: "請輸入樣板名稱",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 50,
                        message: "長度最少2個字最多50個字",
                        trigger: "blur"
                    }
                ],
                tmp_code: [
                    {
                        required: true,
                        message: "請數入樣板代碼",
                        trigger: "blur"
                    }
                ],
                public: [
                    {
                        required: true,
                        message: "請選擇是否為共用樣板",
                        trigger: "change"
                    }
                ],
                active: [
                    {
                        required: true,
                        message: "請選擇是否啟用樣板",
                        trigger: "change"
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
            self.$emit("onCloseDialog");
            self.$refs.form.clearValidate(["name", "tmp_code", "public", "active"]);
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
        // 新增樣板
        async add(form) {
            let self = this;
            try {
                await AddTemplateApi(form);
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
        // 更新樣板
        async update(form) {
            let self = this;
            try {
                await UpdateTemplateApi(form);
                self.$message({
                    type: "success",
                    message: "更新成功"
                });
                // 關閉彈窗
                self.closeDialog();
                // 重新取得資料
                self.refresh();
            } catch (err) {
                console.log(err);
                self.$message({
                    type: "error",
                    message: "更新失敗"
                });
            }
        },
        async onSubmit(formName) {
            let self = this;
            // 判斷是否有傳送新的logo 圖檔
            if (self.photoFile !== null) {
                self.form.img_path = self.photoFile;
            }
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(self.form).map((objKey) => {
                result.append(objKey, self.form[objKey]);
            });
            try {
                await self.$refs[formName].validate();
                // 判斷是否為更新
                if (self.checkEdit) {
                    self.form.template_id = self.formId;
                    self.update(result);
                    return;
                }
                self.add(result);
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
         * 取得樣板詳細資料
         * @param { type String or Number(字串或數字) } id
         */
        async getDetail(id) {
            let self = this;
            try {
                let { data } = await TemplateDetailApi(id);
                self.form = {
                    template_id: data.data.template_id,
                    name: data.data.name,
                    public: data.data.public,
                    active: data.data.active,
                    tmp_code: data.data.tmp_code
                };
                self.tmpImg = data.data.img_path;
                self.defaultCheckedKeys = data.data.operator_ids === null ? [] : JSON.parse(data.data.operator_ids);
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
        }
    },
    created() {
        let self = this;
        // 判斷是否更新
        if (self.checkEdit) {
            self.getDetail(self.formId);
        }
        // 取得下層管理者樹狀資料
        self.getOperatorTreeLists(self.getOperatorId);
    }
};
</script>
