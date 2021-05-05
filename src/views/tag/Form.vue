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
                <el-form-item label="標籤名稱"
                              prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="標籤代碼"
                              prop="name">
                    <el-input v-model="form.key"></el-input>
                </el-form-item>
                <el-form-item label="狀態"
                              prop="active">
                    <el-switch style="display: block;"
                               v-model="form.active"
                               active-color="#2dce89"
                               inactive-color="#f5365c"
                               active-text="啟用"
                               :active-value="1"
                               :inactive-value="0"
                               inactive-text="禁止">
                    </el-switch>
                </el-form-item>
                <el-form-item label="標籤類別">
                    <el-checkbox-group v-model="perChecked">
                        <el-checkbox-button v-for="(item,index) in tagTypeOptions"
                                            :label="item.value"
                                            :key="index">
                            {{ item.label }}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="w-100"
                 v-if="user.group.group_code === 'SYSTEM'">
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
<script>
import { mapState, mapGetters } from "vuex";
// 導入 lodash套件
import _ from "lodash";
/**
 * AddTagApi = 新增標籤 api
 * UpdateTagApi = 更新標籤 api
 * TagDataApi = 取的標籤資料 api
 */
import { AddTagApi, UpdateTagApi, TagDataApi } from "../../api/tagApi";
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
        }
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            // 預設給予不啟用標籤狀態
            form: { active: 0 },
            // 選中標籤種類 (預設選中 SERVICE(服務) 種類)
            perChecked: [1],
            // 可選擇標籤類別
            tagTypeOptions: [
                {
                    type: "SERVICE",
                    label: "技術",
                    value: 1
                },
                {
                    type: "PRODUCT",
                    label: "產品",
                    value: 2
                },
                {
                    type: "CATEGORY",
                    label: "分類",
                    value: 4
                },
                {
                    type: "COMMODITY",
                    label: "商品",
                    value: 8
                }
            ],
            // 驗證規則
            rules: {
                name: [
                    {
                        required: true,
                        message: "請輸入標籤名稱",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 30,
                        message: "長度最少2個字最多30個字",
                        trigger: "blur"
                    }
                ],
                key: [
                    {
                        required: true,
                        message: "請選擇標籤代碼",
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
            // 預設給予不啟用標籤狀態
            self.form = { active: 0 };
            // 選中標籤種類 (預設選中 SERVICE(服務) 種類)
            self.perChecked = [1];
            self.defaultCheckedKeys = [];
            self.$emit("onCloseDialog");
            self.$refs.form.resetFields();
        },
        // 新增標籤
        async add(form) {
            let self = this;
            try {
                await AddTagApi(form);
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
        // 更新標籤
        async update(form) {
            let self = this;
            try {
                await UpdateTagApi(form);
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
        async onSubmit(formName) {
            let self = this;
            try {
                await self.$refs[formName].validate();
                // 如果沒有選擇標籤種類時 預設為 設計師專用標籤
                self.form.permission_rule = _.sum(self.perChecked) === 0 ? 1 : _.sum(self.perChecked);
                if (self.form.operator_ids === null) {
                    self.form.operator_ids = JSON.stringify([]);
                }
                // 判斷是否為更新
                if (self.checkEdit) {
                    self.form.tag_id = self.formId;
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
         * 取得標籤單一資料
         * @param { type String or Number(字串或數字) } tagId 標籤id
         */
        async getData(tagId) {
            let self = this;
            try {
                let { data } = await TagDataApi(tagId);
                self.form = data.data.data;
                // 選中的標籤類別(用來判斷此標籤可以給哪種狀態下出現選擇)
                self.perChecked = data.data.selectPermissionRule;
                // 可選擇標籤類別
                // self.tagTypeOptions = data.data.categoryType;
                self.defaultCheckedKeys = data.data.data.operator_ids === null ? [] : JSON.parse(data.data.data.operator_ids);
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
            self.getOperatorTreeLists(self.getOperatorId)
        }
    }
};
</script>
