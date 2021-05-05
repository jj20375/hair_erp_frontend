<template>
    <div>
        <button class="hotBtn-outline borderRadius10 px-3 py-2 mr-2"
                @click="backClick()">
            返回列表
        </button>
        <button class="darkBtn float-right borderRadius10 px-3 py-2"
                v-if="$route.meta.params.Update==1"
                @click="onSubmit()">
            更新權限
        </button>
        <div class="clearfix"></div>
        <el-table :data="datas"
                  class="w-100 mb-2"
                  row-key="key"
                  stripe
                  border
                  default-expand-all
                  ref="rolesData"
                  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="key"
                             cell-class-name="text-nowrap"
                             label="權限">
                <template v-slot="scope">
                    <span :class="{'text-primary': scope.row.is_option !==0, 'red-color': scope.row.parent_id === null}">{{ scope.row.str }}</span>
                </template>
            </el-table-column>
            <el-table-column cell-class-name="text-nowrap"
                             label="附加功能">
                <template v-slot="scope">
                    <div v-if="haveOptions[scope.row.key]">
                        <b-form-group label="選擇附加功能">
                            <b-form-checkbox-group id="checkbox-group-2"
                                                   v-model="checkOptions[scope.row.key]"
                                                   name="flavour-2">
                                <b-form-checkbox v-for="(item,index) in haveOptions[scope.row.key]"
                                                 v-show="user.group.group_code === 'SYSTEM' || user.group.group_code !== 'SYSTEM' && (item.key === 'accountControl_operator_permissionSet' || item.key === 'accountControl_designer_panel' || item.key === 'member_addPoint')"
                                                 :key="index"
                                                 :value="item">{{item.name}}</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-checkbox-group v-model="checkedCreate"
                                       class="d-inline-block">
                        <el-checkbox size="small"
                                     class="m-0"
                                     :label="scope.row.key"
                                     :disabled="checkCreateDisabled[scope.row.key]"
                                     border>新增
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="checkedRead"
                                       class="d-inline-block">
                        <el-checkbox size="small"
                                     class="m-0"
                                     :label="scope.row.key"
                                     :disabled="checkReadDisabled[scope.row.key]"
                                     border>讀取
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="checkedUpdate"
                                       class="d-inline-block">
                        <el-checkbox size="small"
                                     class="m-0"
                                     :label="scope.row.key"
                                     :disabled="checkUpdateDisabled[scope.row.key]"
                                     border>更新
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="checkedDelete"
                                       class="d-inline-block">
                        <el-checkbox size="small"
                                     class="m-0"
                                     :label="scope.row.key"
                                     :disabled="checkDeleteDisabled[scope.row.key]"
                                     border>刪除
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapState } from "vuex";
/**
 * UpdateGroupPermissionApi = 更新角色群組權限
 * GroupTreePermissionApi = 樹狀權限資料
 * GroupPermissionCRUDApi = 權限CRUD資料
 * GroupPermissionListsApi = 權限列表資料
 */
import { GroupTreePermissionApi, GroupPermissionListsApi, GroupPermissionCRUDApi, UpdateGroupPermissionApi } from "../../api/permissionGroupApi";
import _ from "lodash";
export default {
    computed: {
        ...mapState("userStore", ["user"])
    },
    data() {
        return {
            // 判斷預設權限 新增權限是否選取
            checkedCreate: [],
            // 判斷預設權限 讀取權限是否選取
            checkedRead: [],
            // 判斷預設權限 更新權限是否選取
            checkedUpdate: [],
            // 判斷預設權限 刪除權限是否選取
            checkedDelete: [],
            // 判斷預設權限 新增功能是否 disabled
            checkCreateDisabled: {},
            // 判斷預設權限 讀取功能是否 disabled
            checkReadDisabled: {},
            // 判斷預設權限 更新功能是否 disabled
            checkUpdateDisabled: {},
            // 判斷預設權限 刪除功能是否 disabled
            checkDeleteDisabled: {},
            // 預設權限樹狀資料
            datas: [],
            // 預設權限列表
            permissionLists: [],
            // 可選子項功能
            haveOptions: {},
            // 選中的子項功能
            checkOptions: {}
        };
    },
    methods: {
        // 取得預設權限樹狀列表資料
        async getPermissionTreeLists() {
            let self = this;
            // 取得當前頁面id 等同於目前選擇群組的id
            let groupCode = self.$route.params.groupCode;
            try {
                let { data } = await GroupTreePermissionApi(groupCode);
                self.datas = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得權限樹狀資料失敗"
                });
            }
        },
        // 取得預設權限非樹狀列表資料
        async getPermissionLists() {
            let self = this;
            // 取得當前頁面id 等同於目前選擇群組的id
            let groupCode = self.$route.params.groupCode;
            try {
                let { data } = await GroupPermissionListsApi(groupCode);
                self.permissionLists = data.data;
                // 新增子項功能可選擇按鈕
                self.permissionLists.forEach((item) => {
                    self.$set(self.haveOptions, item.key, item.have_options === null ? false : JSON.parse(item.have_options));
                    self.$set(self.checkOptions, item.key, []);
                });
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得權限資料失敗"
                });
            }
        },
        // 取得預設權限 CRUD 設定值資料
        async getPermissionCRUDLists() {
            let self = this;
            // 取得當前頁面id 等同於目前選擇群組的id
            let groupId = self.$route.params.id;
            // 取得當前頁面groupCode 等同於目前選擇群組的groupCode
            let groupCode = self.$route.params.groupCode;
            try {
                let { data } = await GroupPermissionCRUDApi(groupCode, groupId);
                let permissionsCRUDList = data.data.responseData;
                // 判斷是否預設選取 新增 更新 讀取 刪除 按鈕
                function checkCRUDChose(CRUD, arr, keyName) {
                    // 判斷值為 1 時才做選取
                    if (CRUD === 1) {
                        arr.push(keyName);
                    }
                }
                // 迴圈整理需選取的  新增 更新 讀取 刪除 按鈕 以及需要 disabled的按鈕
                permissionsCRUDList.forEach((item) => {
                    // 判斷是否有子項功能
                    if (item.options !== null) {
                        self.$set(self.checkOptions, item.key, item.options);
                    }

                    self.$set(self.checkCreateDisabled, item.key, item.per_create.disabled === 0 ? false : true);
                    self.$set(self.checkReadDisabled, item.key, item.per_read.disabled === 0 ? false : true);
                    self.$set(self.checkUpdateDisabled, item.key, item.per_update.disabled === 0 ? false : true);
                    self.$set(self.checkDeleteDisabled, item.key, item.per_delete.disabled === 0 ? false : true);
                    checkCRUDChose(item.per_create.value, self.checkedCreate, item.key);
                    checkCRUDChose(item.per_read.value, self.checkedRead, item.key);
                    checkCRUDChose(item.per_update.value, self.checkedUpdate, item.key);
                    checkCRUDChose(item.per_delete.value, self.checkedDelete, item.key);
                });
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得群組權限CRUD資料失敗"
                });
            }
        },
        // 修改角色權限
        async onSubmit() {
            let self = this;
            // 表單發送 群組權限crud設定值資料
            let result = [];
            // 回圈整理出目前可選擇的權限資料
            self.permissionLists.forEach((item, index) => {
                result.push({
                    key: item.key,
                    permission_id: item.id,
                    group_id: self.$route.params.id,
                    per_create: 0,
                    per_read: 0,
                    per_update: 0,
                    per_delete: 0,
                    options: null
                });
            });
            /**
             * 將回圈整理好的格式 與 crud 個別陣列中儲存的 權限 key 做比對
             * 比對成功時 代表此權限 擁有 crud 中比對成功的功能
             */
            result.forEach((item, index) => {
                Object.keys(self.checkOptions).map((objKey) => {
                    if (item.key === objKey) {
                        result[index].options = self.checkOptions[objKey].length <= 0 ? null : JSON.stringify(self.checkOptions[objKey]);
                    }
                });
                // 比對 新增功能 權限key
                self.checkedCreate.forEach((item2) => {
                    if (item.key === item2) {
                        // 比對成功時需將對應的key 新增功能值 改為1
                        result[index].per_create = 1;
                    }
                });
                // 比對 讀取功能 權限key
                self.checkedRead.forEach((item2) => {
                    if (item.key === item2) {
                        // 比對成功時需將對應的key 讀取功能值 改為1
                        result[index].per_read = 1;
                    }
                });
                // 比對 更新功能 權限key
                self.checkedUpdate.forEach((item2) => {
                    if (item.key === item2) {
                        // 比對成功時需將對應的key 更新功能值 改為1
                        result[index].per_update = 1;
                    }
                });
                // 比對 刪除功能 權限key
                self.checkedDelete.forEach((item2) => {
                    if (item.key === item2) {
                        // 比對成功時需將對應的key 刪除功能值 改為1
                        result[index].per_delete = 1;
                    }
                });
            });
            // 表單發送資料
            let sendData = {
                // 群組id
                groupId: self.$route.params.id,
                // crud 權限資料
                datas: result
            };
            try {
                await UpdateGroupPermissionApi(sendData);
                self.$message({
                    type: "success",
                    message: "更新成功"
                });
                self.backClick();
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新失敗"
                });
            }
        },
        // 返回角色權限列表
        backClick() {
            let self = this;
            self.$router.push({ name: "system_roles" });
        }
    },
    created() {
        let self = this;
        // 取得非樹狀的預設權限列表
        self.getPermissionLists();
        // 取得樹狀的預設權限列表
        self.getPermissionTreeLists();
        // 取得預設權限 CRUD 設定值
        setTimeout(() => {
            self.getPermissionCRUDLists();
        }, 500);
    }
};
</script>

<style lang="scss" scoped>
.checkboxBtn {
    line-height: 40px;
    background-color: #eee;
    padding: 7px 15px 5px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
}
</style>