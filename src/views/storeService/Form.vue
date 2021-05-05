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
                <el-form-item label="技術名稱"
                              prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="技術價格"
                              prop="name">
                    <el-input type="number"
                              v-model.number="form.price"></el-input>
                </el-form-item>
                <el-form-item prop="category_id"
                              label="選擇分類">
                    <el-select v-model="form.category_id"
                               placeholder="請選擇狀態">
                        <el-option v-for="(item,index) in categoryOptions"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.category_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="選擇標籤">
                    <el-select v-model="form.tagIds"
                               class="w-100"
                               multiple
                               placeholder="請選擇">
                        <el-option v-for="(item, index) in tagOptions"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.tag_id">
                        </el-option>
                    </el-select>
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
import _ from "lodash";
// CategorySelectListApi = 取的可選擇的分類 api
import { CategorySelectListApi } from "../../api/categoryApi";
// 取的可選擇的標籤 api
import { TagSelectListApi } from "../../api/tagApi";
/**
 * CreateOperatorServiceApi = 新增服務 api
 * UpdateOperatorServiceApi = 更新服務 api
 */
import { CreateOperatorServiceApi, UpdateOperatorServiceApi } from "../../api/operatorApi";
// 取得服務資料 api
import { StoreServiceAbleDataApi } from "../../api/storeServiceApi";
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
        // 管理者id
        operatorId: {
            type: [String, Number]
        }
    },
    filters: {
        showCategoryTypeName(val) {
            let typeName = {
                DESIGNER: "設計師",
                OPERATOR: "管理者"
            };
            return typeName[val];
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
            // 可選擇分類代碼
            categoryOptions: [],
            // 可選擇標籤代碼
            tagOptions: [],
            // 驗證規則
            rules: {
                name: [
                    {
                        required: true,
                        message: "請輸入技術名稱",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 50,
                        message: "長度最少2個字最多50個字",
                        trigger: "blur"
                    }
                ],
                price: [
                    {
                        required: true,
                        message: "請輸入技術價格",
                        trigger: "blur"
                    }
                ],
                category_id: [
                    {
                        required: true,
                        message: "請選擇技術分類",
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
            self.defaultCheckedKeys = [];
            self.$emit("onCloseDialog");
            self.$refs.form.resetFields();
        },
        // 新增服務
        async add(form) {
            let self = this;
            try {
                await CreateOperatorServiceApi(form);
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
        // 更新服務
        async update(form) {
            let self = this;
            try {
                await UpdateOperatorServiceApi(form);
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
                self.form.operatorId = self.operatorId;
                // 如果沒有選擇分類種類時 預設為 設計師專用分類
                if (self.form.operator_ids === null) {
                    self.form.operator_ids = JSON.stringify([]);
                }
                // 判斷是否為更新
                if (self.checkEdit) {
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
         * 取得技術項目單一資料
         * @param { type String or Number(字串或數字) } serviceId 技術項目id
         * @param { type String(字串) } ableType 關聯表類型 (ex: "designer" or "operator")
         */
        async getData(serviceId, ableType) {
            let self = this;
            try {
                let { data } = await StoreServiceAbleDataApi(serviceId, ableType);
                self.form = {
                    name: data.data.store_service.name,
                    price: data.data.store_service.store_service_info.price,
                    category_id: data.data.store_service.category.category_id,
                    operatorId: self.operatorId,
                    service_id: data.data.service_id,
                    tagIds: _.map(data.data.store_service.morph_to_many_tag, "tag_id")
                };
                // 可選擇分類類別
                self.defaultCheckedKeys = data.data.store_service.operator_ids === null ? [] : JSON.parse(data.data.store_service.operator_ids);
            } catch (err) {
                console.log(err);
                self.$message({
                    type: "error",
                    message: "取得詳細資料失敗"
                });
            }
        },
        /**
         * @param { type String(字串) } categoryType 分類種類
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getCategory(categoryType, operatorId) {
            let self = this;
            try {
                let { data } = await CategorySelectListApi(categoryType, operatorId);
                self.categoryOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得分類失敗"
                });
            }
        },
        /**
         * @param { type String(字串) } tagType 標籤種類
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getTag(tagType, operatorId) {
            let self = this;
            try {
                let { data } = await TagSelectListApi(tagType, operatorId);
                self.tagOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得標籤失敗"
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
                self.getData(self.formId, "operator");
                self.getCategory("OPERATOR", self.operatorId);
                self.getTag("SERVICE", self.operatorId);
            } else {
                let operatorId = self.$route.params.operatorId === undefined ? self.getOperatorId : self.$route.params.operatorId;
                self.getCategory("OPERATOR", parseInt(operatorId));
                self.getTag("SERVICE", parseInt(operatorId));
            }
            // 取得下層管理者樹狀資料
            self.getOperatorTreeLists(self.getOperatorId);
        }
    }
};
</script>
