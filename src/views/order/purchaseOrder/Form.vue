<template>
    <div>
        <button class="hotBtn-outline borderRadius10 px-3 py-2 mb-2"
                @click="back()">返回列表</button>
        <div class="float-right" v-if="!checkEdit">
            <button class="hotBtn-outline ml-2 borderRadius10 px-3 py-2"
                    @click="addRow()">新增欄位</button>
        </div>
        <div class="clearfix"></div>
        <div class="table-responsive animated fadeIn">
            <table class="table table-bordered"
                   v-loading="loading">
                <thead class="hotBg text-center">
                    <th class="text-center ">
                    <td class="text-white pt-1 pb-1">#</td>
                    </th>
                    <th v-for="(item,key) in products[0]"
                        :key="key"
                        class="text-center"
                        v-show="showKey(key)">
                    <td class="text-white text-center pt-1 pb-1">
                        {{key | showThead}}
                    </td>
                    </th>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in products"
                        :key="index">
                        <td>
                            {{index+1}}
                            <button v-if="form[index]['purchase_info_id'] === 0 && index !== 0"
                                    class="btn btn-danger"
                                    @click="deleteRow(index)">刪除行</button>
                        </td>
                        <td v-for="(item2,key) in item"
                            :key="key"
                            v-show="showKey(key)">
                            <el-select v-if="key === 'provider_id'"
                                       v-model="form[index][key]"
                                       @change="providerChange(index, form[index][key])"
                                       :disabled="checkEdit"
                                       placeholder="請選擇">
                                <el-option v-for="(item, index) in providerOptions"
                                           :key="index"
                                           :label="item.name"
                                           :value="item.provider_id">
                                </el-option>
                            </el-select>
                            <el-select v-else-if="key === 'product_id'"
                                       v-model="form[index][key]"
                                       @change="productChange(index, form[index][key])"
                                       :disabled="checkEdit"
                                       placeholder="請選擇">
                                <el-option v-for="(item, index) in productOptions"
                                           :key="index"
                                           :label="item.name"
                                           :value="item.product_id">
                                </el-option>
                            </el-select>
                            <el-input v-else-if="key === 'note'"
                                      type="textarea"
                                      :placeholder="key"
                                      v-model="form[index][key]">
                            </el-input>
                            <el-input v-else
                                      type="number"
                                      :placeholder="key"
                                      :disabled="checkEdit && key === 'quantity'"
                                      v-model.number="form[index][key]">
                            </el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <el-form :label-position="'left'"
                 ref="formOrder"
                 class="mt-2"
                 label-width="120px"
                 :model="formOrder">
            <div class="row">
                <div class="col-md-4">
                    <el-form-item label="訂單標題"
                                  prop="title"
                                  :rules="{ required: true, message: '請輸入訂單標題', trigger: 'blur' }">
                        <el-input placeholder="請輸入訂單標題"
                                  v-model="formOrder.title">
                        </el-input>
                    </el-form-item>
                </div>
                <div class="col-md-4">
                    <el-form-item label="訂單日期"
                                  prop="order_date"
                                  :rules="{ required: true, message: '請選擇訂單日期', trigger: 'change' }">
                        <el-date-picker v-model="formOrder.order_date"
                                        type="date"
                                        placeholder="選擇日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="col-md-4">
                    <el-form-item label="客製化訂單號">
                        <el-input placeholder="請輸入客製化單號"
                                  v-model="formOrder.order_operator_number">
                        </el-input>
                    </el-form-item>
                </div>
                <div class="col-md-8">
                    <el-form-item label="訂單號備註">
                        <el-input class="w-100"
                                  type="textarea"
                                  placeholder="請輸入訂單號備註"
                                  v-model="formOrder.order_note">
                        </el-input>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <div class="mt-2">
            <button class="darkBtn borderRadius10 px-3 py-2 mb-2"
                    v-if="$route.meta.params.Create == 1 && (user.group.group_code !== 'SYSTEM' || $route.params.operatorId !== undefined)"
                    @click="onSubmit('formOrder')">
                {{ submitText }}
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/deep/ .table thead td {
    border: none;
}
</style>

<script>
import { mapState } from "vuex";
// 日期轉換格式
import moment from "moment";
// 判斷是否為空值 或 undefined 或 null
import { isEmpty } from "../../../service/anyService";
// 取得進貨訂單資料
/**
 * PurchaseOrderDataApi = 取得進貨訂單資料
 * UpdatePurchaseOrderApi = 更新進貨訂單資料
 * AddPurchaseOrderApi = 新增進貨訂單資料
 */
import {
    PurchaseOrderDataApi,
    UpdatePurchaseOrderApi,
    AddPurchaseOrderApi,
} from "../../../api/purchaseOrderApi";
// 取得可選擇產品列表
import { ProductSelectListApi } from "../../../api/productApi";
// 取得可選擇廠商列表
import { ProviderSelectListApi } from "../../../api/providerApi";
export default {
    data() {
        return {
            // 產品訂單列表
            products: [],
            // 進貨明細資料
            form: [],
            // 進貨單資料
            formOrder: {},
            // 可選擇廠商代碼
            providerOptions: [],
            // 可選擇產品代碼
            productOptions: [],
            // 判斷是否為更新
            checkEdit: false,
            loading: false,
        };
    },
    filters: {
        showThead(value) {
            switch (value) {
                case "product_id":
                    return "產品";
                    break;
                case "provider_id":
                    return "廠商";
                    break;
                case "price":
                    return "金額";
                    break;
                case "quantity":
                    return "數量";
                    break;
                case "note":
                    return "備註";
                default:
                    return value;
                    break;
            }
        },
    },
    computed: {
        ...mapState("userStore", ["user"]),
        // 用來判斷是要呈現更新還是新增的按鈕
        submitText() {
            let self = this;
            if (self.$route.params.orderNumber !== undefined) {
                return "更新";
            }
            return "新增";
        },
    },
    methods: {
        /**
         * 判斷隱藏哪些key在table上
         * @param { type String(字串) } key 隱藏key
         */
        showKey(key) {
            let keyArr = [
                "purchase_order_id",
                "purchase_info_id",
                "created_at",
                "updated_at",
                "operator_id",
                "provider_name",
                "product_name",
                "total",
            ];
            return !keyArr.includes(key);
        },
        /**
         * 新增欄位
         */
        addRow() {
            let self = this;
            // 儲存進貨明細傳送 key 變數
            let obj = {};
            // 回圈取出目前進貨明細需傳送key
            Object.keys(self.products[0]).map((objKey) => {
                // 新增欄位時給予欄位預設 key 值設定為 nul
                obj[objKey] = null;
                // 判斷 是否為進貨訂單 id
                if (objKey === "purchase_order_id") {
                    // 將進貨訂單id 值給予 purchase_order_id key
                    obj[objKey] = self.products[0][objKey];
                }
                // 判斷是否為進貨明細id
                if (objKey === "purchase_info_id") {
                    // 因為是新增的進貨明細資料 因此 進貨明細上不會有 id 因此給與 0 值 如果後端偵測到 0 值就知道需要執行新增方法
                    obj[objKey] = 0;
                }
            });
            // 將進貨單上新增一個空的進貨明細欄位
            self.products.push(obj);
            // 將表單傳送值上新增一個空的進貨明細欄位
            self.form.push(obj);
        },
        // 刪除多餘的進貨明細欄位
        deleteRow(index) {
            let self = this;
            self.form.splice(index, 1);
            self.products.splice(index, 1);
        },
        /**
         * 取得進貨訂單單一資料
         * @param { type String or Number(字串或數字) } orderNumber 進貨訂單號
         */
        async getData(orderNumber) {
            let self = this;
            try {
                let { data } = await PurchaseOrderDataApi(orderNumber);
                // 產品訂單資料
                self.products = data.data.purchase_info;
                self.formOrder = {
                    title: data.data.title,
                    order_date: data.data.order_date,
                    order_note: data.data.note,
                    order_operator_number: data.data.order_operator_number,
                };
                // 資料設定
                data.data.purchase_info.forEach((item, index) => {
                    self.$set(self.form, index, item);
                });
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得詳細資料失敗",
                });
            }
        },
        /**
         * 產品更換時
         * @param { type Number(數字) } index form 索引值
         * @param { type Number(數字) } value 選中得產品id
         */
        productChange(index, value) {
            let productName = "";
            let self = this;
            self.productOptions.forEach((item) => {
                if (value === item.product_id) {
                    productName = item.name;
                }
            });
            self.$set(self.form[index], "product_name", productName);
        },
        /**
         * 廠商更換時
         * @param { type Number(數字) } index form 索引值
         * @param { type Number(數字) } value 選中得廠商id
         */
        providerChange(index, value) {
            let providerName = "";
            let self = this;
            self.providerOptions.forEach((item) => {
                if (value === item.provider_id) {
                    providerName = item.name;
                }
            });
            self.$set(self.form[index], "provider_name", providerName);
        },
        /**
         * 取得可選擇廠商
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getProvider(operatorId) {
            let self = this;
            try {
                let { data } = await ProviderSelectListApi(operatorId);
                self.providerOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得廠商失敗",
                });
            }
        },
        /**
         * 取得可選擇產品
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getProduct(operatorId) {
            let self = this;
            try {
                let { data } = await ProductSelectListApi(operatorId);
                self.productOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得產品失敗",
                });
            }
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            let sendData = {
                datas: self.form,
            };
            try {
                await self.$refs[formName].validate();
                // 判斷是否有輸入客製化訂單號
                if (!isEmpty(self.formOrder.order_operator_number)) {
                    sendData["order_operator_number"] =
                        self.formOrder.order_operator_number;
                }
                // 判斷是否有輸入訂單備註
                if (!isEmpty(self.formOrder.order_note)) {
                    sendData["order_note"] = self.formOrder.order_note;
                }
                sendData["order_date"] = moment(
                    self.formOrder.order_date
                ).format("YYYY/MM/DD HH:mm:ss");
                sendData["title"] = self.formOrder.title;
                sendData["operator_id"] = self.$route.params.operatorId;
                if (self.checkEdit) {
                    self.update(sendData);
                } else {
                    self.add(sendData);
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗",
                });
            }
        },
        // 更新進貨訂單
        async update(form) {
            let self = this;
            self.loading = true;
            try {
                await UpdatePurchaseOrderApi(form);
                self.loading = false;
                self.$message({
                    type: "success",
                    message: "更新成功",
                });
                // 重新取得資料
                self.getData(self.$route.params.orderNumber);
            } catch (err) {
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "更新失敗",
                });
            }
        },
        // 新增進貨訂單
        async add(form) {
            let self = this;
            self.loading = true;
            try {
                await AddPurchaseOrderApi(form);
                self.loading = false;
                self.$message({
                    type: "success",
                    message: "新增成功",
                });
                // 重新取得資料
                self.back();
            } catch (err) {
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "新增失敗",
                });
            }
        },
        //返回列表
        back() {
            let self = this;
            self.$router.push({ name: "orderControl_purchase_order_list" });
        },
    },
    created() {
        let self = this;
        self.getProvider(self.$route.params.operatorId);
        self.getProduct(self.$route.params.operatorId);
        if (self.$route.params.orderNumber !== undefined) {
            self.getData(self.$route.params.orderNumber);
            self.checkEdit = true;
        } else {
            // 預設初始值 新增進貨訂單預設需傳入key
            self.products = [
                {
                    provider_id: null,
                    product_id: null,
                    quantity: 0,
                    price: 0,
                    purchase_info_id: 0,
                    note: null,
                },
            ];
            // 預設初始值 新增進貨訂單預設需傳入key
            self.form = [
                {
                    provider_id: null,
                    product_id: null,
                    quantity: 0,
                    price: 0,
                    purchase_info_id: 0,
                    note: null,
                },
            ];
        }
    },
};
</script>