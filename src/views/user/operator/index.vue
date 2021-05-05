<template>
    <div>
        <b-breadcrumb v-if="parent.length > 0">
            <b-breadcrumb-item v-for="(item,index) in parent"
                               @click="breadcrumbClick(item, index)"
                               :active="(index + 1) === parent.length"
                               :key="index">
                {{ item.name }}
            </b-breadcrumb-item>
        </b-breadcrumb>
        <div class="float-left">
            <button class="hotBtn-outline borderRadius10 px-3 py-2 mr-2"
                    v-if="parent.length !==0"
                    @click="backDepth()">返回上層
            </button>
            <button class="hotBtn-outline borderRadius10 px-3 py-2 mr-2"
                    v-if="parent.length !==0 && parent.length > 2"
                    @click="backTopDepth()">返回最上層
            </button>
            <button class="darkBtn borderRadius10 px-3 py-2"
                    v-if="$route.meta.params.Create === 1"
                    @click="clickDialog(depth)"><i class="fas fa-plus mr-1"></i>新增
            </button>
        </div>
        <div class="float-right">
            <badge type="default">目前層級：{{ depth }}</badge>
            <badge type="primary">目前用戶: {{ operator.name }}</badge>
        </div>
        <div class="clearfix"></div>
        <div class="table-responsive">
            <el-table :data="datas"
                      header-cell-class-name="text-left align-middle bg-dark text-white"
                      class="myTable"
                      cell-class-name="text-left align-middle"
                      border
                      style="width:100%;">
                <el-table-column label="#"
                                 width="80">
                    <template v-slot="scope">
                        <span>{{ scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="名稱"
                                 min-width="150">
                    <template v-slot="scope">
                        <div v-loading="loading">
                            <div class="mb-2">
                                <h5 class="secnodBorder borderBottomWidth3 mb-0 pointer d-inline-block second-color"
                                    :disabled="loading"
                                    @click="changeAgent(scope.row)">
                                    {{ scope.row.account }}&nbsp;<i class="far fa-external-link"></i>
                                </h5>
                            </div>
                            <h5 class="m-0 hot-color"
                                v-if="scope.row.name !== ''">名稱：{{ scope.row.name }}</h5>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="時間"
                                 min-width="200">
                    <template v-slot="scope">
                        <div class="gray-color">創建時間:<span class="ml-2">{{ scope.row.created_at | formatDateTime }}</span></div>
                        <div class="font-weight-bold">最後登入:<span class="ml-2">{{ scope.row.user.login_time | formatUnixDate }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column label="登入IP"
                                 min-width="200">
                    <template v-slot="scope">
                        <div class="gray-color">創建IP:<span class="ml-2">{{ scope.row.user.create_ip }}</span></div>
                        <div class="font-weight-bold">最後登入IP:<span class="ml-2">{{ scope.row.user.last_ip }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                 label="啟用狀態"
                                 min-width="200">
                    <template v-slot="scope">
                        <badge type="primary">
                            <el-switch style="display: block;"
                                       v-model="scope.row.status"
                                       :disabled="$route.meta.params.Update==0"
                                       active-color="#2dce89"
                                       inactive-color="#f5365c"
                                       active-text="啟用"
                                       :active-value="5"
                                       :inactive-value="0"
                                       inactive-text="禁止"
                                       @change="onActive(scope.row, scope.$index)">
                            </el-switch>
                        </badge>
                    </template>
                </el-table-column>
                <el-table-column label="設置"
                                 min-width="150">
                    <template v-slot="scope">
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('accountControl_operator_permissionSet')"
                                     @click="$router.push({name: 'accountControl_operator_permissionSet', params:{id: scope.row.user.user_id, groupCode: scope.row.user.group.group_code}})">權限</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('accountControl_sub')"
                                     @click="$router.push({name: 'accountControl_sub', params:{type: 'OPERATOR', userId: scope.row.user.user_id, operatorId: scope.row.operator_id}})">子帳號</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('accountControl_assistant')"
                                     @click="$router.push({name: 'accountControl_assistant', params:{id: scope.row.operator_id}})">助理</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('accountControl_designer')"
                                     @click="$router.push({name: 'accountControl_designer', params:{id: scope.row.operator_id}})">設計師</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('accountControl_member')"
                                     @click="$router.push({name: 'accountControl_member', params:{operatorId: scope.row.operator_id}})">會員</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('webControl_storeService')"
                                     @click="$router.push({name: 'webControl_storeService', params:{operatorId: scope.row.operator_id}})">技術</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('commodity_provider_list')"
                                     @click="$router.push({name: 'commodity_provider_list', params:{operatorId: scope.row.operator_id}})">廠商</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('commodity_product_list')"
                                     @click="$router.push({name: 'commodity_product_list', params:{operatorId: scope.row.operator_id}})">產品</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('orderControl_purchase_order_list')"
                                     @click="$router.push({name: 'orderControl_purchase_order_list', params:{operatorId: scope.row.operator_id}})">進貨訂單</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('commodity_list')"
                                     @click="$router.push({name: 'commodity_list', params:{operatorId: scope.row.operator_id}})">商品</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('orderControl_operator_order_list')"
                                     @click="$router.push({name: 'orderControl_operator_order_list', params:{operatorId: scope.row.operator_id }})">商家訂單</base-button>
                        <base-button outline
                                     size="sm"
                                     type="primary"
                                     class="mt-1"
                                     v-if="checkShow('otherControl_salary')"
                                     @click="$router.push({name: 'otherControl_salary', params:{operatorId: scope.row.operator_id }})">薪水</base-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                                 min-width="120">
                    <template v-slot="scope">
                        <button type="button"
                                class="hotBtn-outline borderRadius10 px-2 py-2 font-lg"
                                v-if="$route.meta.params.Update === 1"
                                @click="onEdit(scope.row)">
                            <i class="fad fa-money-check-edit"></i>
                        </button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <OperatorForm v-if="!checkEdit"
                      :showDialog="showDialog"
                      :currentOperatorId="currentOperatorId"
                      @onRefresh="refresh"
                      @onCloseDialog="closeDialog" />
        <OperatorInfoForm v-if="checkEdit"
                          :showDialog="showDialog"
                          :operatorId="operatorId"
                          :currentOperatorId="currentOperatorId"
                          :formAccount="formAccount"
                          @onRefresh="refresh"
                          @onCloseDialog="closeDialog" />
    </div>
</template>
<script>
import { mapMutations, mapState, mapGetters } from "vuex";
// 導入 lodash 套件
import _ from "lodash";
// 導入 swwetalert2 套件
import Swal from "sweetalert2";
import { getStorage, setStorage } from "../../../service/localStorage";
// 新增管理者表單
import OperatorForm from "./OperatorForm.vue";
// 更新管理者表單
import OperatorInfoForm from "./OperatorInfoForm.vue";
/**
 * OperatorUserListApi = 取得管理者層級列表 api
 * UpdateOperatorStatusApi = 更新管理者狀態值 api
 */
import { OperatorUserListApi, UpdateOperatorStatusApi } from "../../../api/operatorApi";
export default {
    components: {
        OperatorForm,
        OperatorInfoForm
    },
    computed: {
        ...mapState("userStore", ["user"]),
        ...mapState("operatorStore", ["operator"]),
        // 取得每個登入身份使用者的管理者id
        ...mapGetters("userStore", ["getOperatorId"])
    },
    data() {
        return {
            showDialog: false,
            // 列表
            datas: [],
            // 目前層級在哪一層
            depth: 0,
            // 確認目前是否為編輯狀態
            checkEdit: false,
            // 存取巢狀的上層管理者
            parent: [],
            // 判定登入者型別
            userType: "",
            // 目前登入者的層級
            defaultDepth: 0,
            // 點擊到的用戶群組分類
            groupType: "",
            // 加載狀態中
            loading: false,
            // 後端送過來層級
            backEndDepth: 0,
            // 搜尋過濾時送出的物件
            filterData: {},
            // 選取啟用狀態值
            searchStatus: null,
            // 搜尋到的帳號
            searchAccount: null,
            // 下拉選單選取啟用狀態
            statusOptions: [
                { name: "啟用", value: 5 },
                { name: "禁止", value: 0 }
            ],
            // 當前頁面
            currentPage: 1,
            // 分頁資料
            paginationData: {
                perPage: 15,
                total: 0
            },
            // 更新管理者時要傳入的 id
            operatorId: null,
            // 新增管理者時與要重取資料時傳入的 id
            currentOperatorId: 0,
            // 更新管理者帳號
            formAccount: null
        };
    },
    methods: {
        ...mapMutations("operatorStore", ["setOperator"]),
        /**
         * 檢查是否要顯示功能按鈕
         * @param { type String(字串) } val 路由名稱
         */
        checkShow(val) {
            let self = this;
            return _.some(self.$route.meta.options, { key: val });
        },
        /**
         * 觸發新增管理者表單彈窗
         * @param { type Number(數字) } depth 層級數字
         */
        clickDialog(depth) {
            let self = this;
            self.showDialog = true;
            self.checkEdit = false;
        },
        /**
         * 打開更新彈窗 並傳入選中的資料
         * @param { type Object(物件) } data 選中的列表資料
         */
        onEdit(data) {
            let self = this;
            self.showDialog = true;
            self.checkEdit = true;
            // 要更新的管理者 id
            self.operatorId = data.operator_id;
            // 更新管理者帳號
            self.formAccount = data.account;
        },
        // 關閉註冊彈窗
        closeDialog() {
            let self = this;
            self.showDialog = false;
        },
        /**
         * 開關管理者啟用狀態
         * @param { type Object(物件) } data 列表資料
         * @example { user_id: users表id, operator_id: user_operators表id, status: 狀態值}
         * @param { type Number(數字) } index 索引值
         */
        async onActive(data, index) {
            let self = this;
            // 表單發送資料
            let sendData = {
                user_id: data.user.user_id,
                operator_id: data.operator_id,
                status: data.status
            };
            try {
                let { value } = await Swal.fire({
                    title: "請問是否更新狀態?",
                    customClass: {
                        container: "zindex10000"
                    },
                    html: `更新管理者：${data.name}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "更新!",
                    cancelButtonText: "取消"
                });
                // 判斷是否點擊更新
                if (value) {
                    try {
                        await UpdateOperatorStatusApi(sendData);
                        self.$message({
                            type: "success",
                            message: "更新成功"
                        });
                        self.closeDialog();
                        self.datas[index].status = data.status;
                    } catch (err) {
                        self.$message({
                            type: "error",
                            message: "更新失敗"
                        });
                        self.datas[index].status = data.status === 5 ? 0 : 5;
                    }
                } else {
                    self.datas[index].status = data.status === 5 ? 0 : 5;
                }
            } catch (err) {}
        },
        /**
         * 將目前管理者層級一層一層加進陣列中 length 數字 等於 目前總共層數
         * @param { type Object(物件) } data 傳入上層管理者資料
         */
        addParent(data) {
            let self = this;
            if (self.parent.length === 0) {
                self.parent.push({
                    name: "最上層",
                    parentId: null,
                    operatorId: self.user.group.group_code === "SYSTEM" ? 0 : self.getOperatorId,
                    depth: 0
                });
            }
            self.parent.push(data);
            setStorage("parent", self.parent);
        },
        /**
         * 進入下一層級事件
         * @param { type Object(物件) } data 選中的列表資料
         */
        changeAgent(data) {
            let self = this;
            self.loading = true;
            self.depth++;
            self.changeOperatorData(data.operator_id, data.name);
            // 進入下層管理者
            self.getOperatorLists(data.operator_id, data);
            // 等待一秒鐘才可在點擊進下層管理者
            setTimeout(() => {
                self.loading = false;
            }, 1000);
        },
        // 返回最上層
        backTopDepth() {
            let self = this;
            self.parent = [];
            self.depth = 0;
            self.currentOperatorId = self.user.group.group_code === "SYSTEM" ? 0 : self.getOperatorId;
            self.getOperatorLists(self.currentOperatorId);
            self.changeOperatorData(null, "最上層");
        },
        // 返回上一層
        backDepth() {
            let self = this;
            // 返回上一層時 減1
            self.depth--;
            // 如果大於 1 的話就抓取 上層管理者對應的index資料
            let parentId = self.parent.length > 1 ? self.parent[self.depth].parent_id : null;
            let operatorId = self.parent.length > 1 ? self.parent[self.depth].operatorId : 0;
            let operatorName = self.parent.length > 1 ? self.parent[self.depth].name : "最上層";
            // 更改當前管理者資料
            self.changeOperatorData(operatorId, operatorName);
            // 取的上層管理者列表
            self.getOperatorLists(operatorId);
            // 返回上層時 將上層管理者陣列值 移除最後一位
            self.parent = _.dropRight(self.parent, 1);
            // 如果上層管理者剩下最上層時，清空上層管理者陣列
            if (self.parent.length === 1) {
                self.parent = [];
            }
        },
        /**
         * 返回點擊到的層級
         * @param { type Object(物件) } data 選中的麵包屑資料
         * @param { type Number(數字) } index 選中的索引值
         */
        breadcrumbClick(data, index) {
            let self = this;
            // 如果大於 1 的話就抓取 上層管理者對應的index資料
            let parentId = self.parent.length > 1 ? self.parent[index].parentId : null;
            let operatorId = self.parent.length > 1 ? self.parent[index].operatorId : 0;
            let operatorName = self.parent.length > 1 ? self.parent[index].name : "最上層";
            // 取得管理者資料
            self.getOperatorLists(operatorId);
            // 更改當前管理者資料
            self.changeOperatorData(operatorId, operatorName);
            // 看是返回幾層 管理者 就扣掉 幾層管理者
            self.parent = _.dropRight(self.parent, self.parent.length - (index + 1));
            // 如果返回時 點擊 麵包屑 那目前層級 等於 麵包屑 的長度
            self.depth = self.parent.length - 1;
            // 如果上層管理者剩下最上層時，清空上層管理者陣列
            if (self.parent.length === 1) {
                self.parent = [];
            }
        },
        /**
         * 取得管理者層級列表
         * @param { type Number or String(數字或字串) } operatorId 需要取得的管理者id operator_id
         * @param { type Object(物件) } operatorDatga 上層管理者的資料
         */
        async getOperatorLists(operatorId = 0, operatorData = null) {
            let self = this;
            self.loading = true;
            try {
                let { data } = await OperatorUserListApi(operatorId);
                self.datas = data.data;
                // 判斷是否有傳入管理者資料
                if (operatorData !== null) {
                    // 將目前選到管理者一層一層新增進陣列裡 用來返回上層用
                    self.addParent({
                        name: operatorData.name,
                        parentId: operatorData.parent_id,
                        operatorId: operatorData.operator_id,
                        depth: self.depth
                    });
                    // 更改當前管理者資料
                    self.changeOperatorData(operatorData.operator_id, operatorData.name);
                }
                setTimeout(() => {
                    self.loading = false;
                }, 500);
            } catch (err) {
                self.loading = false;
                // 取得下一層失敗時 也要減 1
                self.depth--;
                self.$message({
                    type: "error",
                    message: "取的管理者列表失敗"
                });
            }
        },
        /**
         * 重新取得管理者列表資料
         * @param { tpye Number(數字) } operatorId
         */
        refresh(operatorId) {
            let self = this;
            self.getOperatorLists(operatorId);
        },
        /**
         * 更新 當前管理者資料
         * @param { type String or Number(數字或字串) } currentOperatorId 新增管理者時要用的id
         * @param { type String(字串) } operatorNanme
         */
        changeOperatorData(currentOperatorId, operatorName) {
            let self = this;
            // 設定當前頁面管理者id
            self.currentOperatorId = currentOperatorId;
            /* 設定當前頁面管理者id
             設定在 localstorage 最主要是 怕重新整理時 新增時還知道要傳送哪個id */
            // setStorage("currentOperatorId", currentOperatorId);
            // 設定目前層級管理者名稱
            self.setOperator({ name: operatorName });
            // 設定目前層級管理者名稱
            // setStorage("operatorName", operatorName);
        }
    },
    created() {
        let self = this;
        self.currentOperatorId = self.getOperatorId;
        self.getOperatorLists(self.currentOperatorId);
    }
};
</script>
