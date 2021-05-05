<template>
    <div>
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
                     label-width="120px"
                     :model="form"
                     :rules="rules">
                <el-form-item label="群組名稱"
                              prop="group_name">
                    <el-input v-model="form.group_name"></el-input>
                </el-form-item>
                <!-- 更新時不能更改當下群組身份 (ex: 創立時 是系統身份就無法變更為管理者) -->
                <el-form-item v-if="!checkEdit"
                              label="群組代碼"
                              prop="group_code">
                    <el-select class="w-100"
                               v-model="form.group_code"
                               placeholder="請選擇">
                        <el-option-group label="系統"
                                         v-if="user.group.group_code === 'SYSTEM'">
                            <el-option v-for="(item,key) in groups['SYSTEM']"
                                       :key="key"
                                       :label="item.label"
                                       :value="item.groupCode">
                            </el-option>
                        </el-option-group>
                        <el-option-group label="管理者">
                            <el-option v-for="(item,key) in groups['OPERATOR']"
                                       :key="key"
                                       :label="item.label"
                                       :value="item.groupCode">
                            </el-option>
                        </el-option-group>
                        <el-option-group label="設計師">
                            <el-option v-for="(item,key) in groups['DESIGNER']"
                                       :key="key"
                                       :label="item.label"
                                       :value="item.groupCode">
                            </el-option>
                        </el-option-group>
                        <el-option-group label="助理">
                            <el-option v-for="(item,key) in groups['ASSISTANT']"
                                       :key="key"
                                       :label="item.label"
                                       :value="item.groupCode">
                            </el-option>
                        </el-option-group>
                        <el-option-group label="會員"
                                         v-if="user.group.group_code === 'SYSTEM'">
                            <el-option v-for="(item,key) in groups['MEMBER']"
                                       :key="key"
                                       :label="item.label"
                                       :value="item.groupCode">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="子帳號專用"
                              prop="isSub">
                    <badge type="primary">
                        <el-switch style="display: block;"
                                   v-model="form.is_sub"
                                   active-color="#2dce89"
                                   inactive-color="#f5365c"
                                   :active-value="1"
                                   active-text="是"
                                   :inactive-value="0"
                                   inactive-text="否">
                        </el-switch>
                    </badge>
                </el-form-item>
            </el-form>
            <div class="w-100" v-if="user.group.group_code === 'SYSTEM'">
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
/**
 * AddGroupApi = 新增群組
 * UpdateGroupApi = 更新群組
 * GroupDetailApi = 取的群組資料
 */
import { AddGroupApi, UpdateGroupApi, GroupDetailApi } from "../../api/groupApi";
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
            form: {},
            rules: {
                group_name: [
                    {
                        required: true,
                        message: "請輸入群組名稱",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 30,
                        message: "長度最少2個字最多30個字",
                        trigger: "blur"
                    }
                ],
                group_code: [
                    {
                        required: true,
                        message: "請選擇群組分類",
                        trigger: "change"
                    }
                ]
            },
            groups: {
                SYSTEM: [
                    {
                        label: "系統",
                        groupCode: "SYSTEM",
                        permissionRule: 1
                    }
                ],
                OPERATOR: [
                    {
                        label: "管理者",
                        groupCode: "OPERATOR",
                        permissionRule: 2
                    }
                ],
                DESIGNER: [
                    {
                        label: "設計師",
                        groupCode: "DESIGNER",
                        permissionRule: 4
                    }
                ],
                ASSISTANT: [
                    {
                        label: "助理",
                        groupCode: "ASSISTANT",
                        permissionRule: 8
                    }
                ],
                MEMBER: [
                    {
                        label: "會員",
                        groupCode: "MEMBER",
                        permissionRule: 16
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
            self.$emit("onCloseDialog");
            self.$refs.form.clearValidate(["group_name", "group_id"]);
        },
        // 新增群組
        async add(form) {
            let self = this;
            try {
                await AddGroupApi(form);
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
        // 更新群組
        async update(form) {
            let self = this;
            try {
                await UpdateGroupApi(form);
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
            try {
                await self.$refs[formName].validate();
                if (self.form.operator_ids === null) {
                    self.form.operator_ids = JSON.stringify([]);
                }
                // 群組數位權限值
                self.form.permission_rule = self.groups[self.form.group_code][0].permissionRule;
                // 判斷是否為更新
                if (self.checkEdit) {
                    self.form.group_id = self.formId;
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
         * 取得群組詳細資料
         * @param { type String or Number(字串或數字) } id
         */
        async getDetail(id) {
            let self = this;
            try {
                let { data } = await GroupDetailApi(id);
                self.form = data.data;
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
        // 取的下層管理者樹狀資料
        self.getOperatorTreeLists(self.getOperatorId);
    }
};
</script>
