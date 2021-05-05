<template>
    <div>
        <button class="hotBtn-outline borderRadius10 px-3 py-2 mb-2"
                @click="back()">返回列表</button>
        <label class="d-block">選擇設計師</label>
        <el-select v-model="formOrder.designer_id"
                   :disabled="checkEdit"
                   @change="designerChange(formOrder.designer_id)"
                   placeholder="請選擇設計師">
            <el-option v-for="(item, index) in designerOptions"
                       :key="index"
                       :label="item.name"
                       :value="item.designer_id">
            </el-option>
        </el-select>
        <div class="float-right">
            <button class="hotBtn-outline ml-2 borderRadius10 px-3 py-2"
                    v-if="!checkEdit"
                    @click="addRow()">新增欄位</button>
        </div>
        <div class="clearfix"></div>
        <div v-if="formOrder.designer_id !== null"
             class="table-responsive animated fadeIn">
            <table class="table table-bordered"
                   v-loading="loading">
                <thead class="hotBg text-center">
                    <tr class="text-center py-1">
                        <th class="text-white">#</th>
                        <th class="text-white">
                            <div>標題</div>
                        </th>
                        <th class="text-white">
                            <div>訂單類型</div>
                        </th>
                        <th class="text-white">
                            <div>數量</div>
                        </th>
                        <th class="text-white">
                            <div>消費</div>
                        </th>
                        <th class="text-white">
                            <div>協助人員</div>
                        </th>
                        <th class="text-white">
                            <div>備註</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in products"
                        :key="index">
                        <td>
                            {{index+1}}
                            <button v-if="form[index]['operator_info_order_id'] === 0 && index !== 0"
                                    class="btn btn-danger"
                                    @click="deleteRow(index)">刪除行</button>
                        </td>
                        <td>
                            <el-input :placeholder="'標題'"
                                      v-model="form[index]['title']">
                            </el-input>
                        </td>
                        <td>
                            <div>
                                <div>
                                    <label class="d-block">請選擇訂單分類</label>
                                    <el-select v-model="form[index]['orderType']"
                                               :disabled="checkEdit && form[index]['operator_info_order_id'] !== 0"
                                               clearable
                                               placeholder="請選擇訂單分類">
                                        <el-option v-for="(item, index) in orderTypeOptions"
                                                   :key="index"
                                                   :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-if="form[index]['orderType'] !== null && form[index]['orderType'] === 'storeService'">
                                    <label class="d-block">請選擇此技術為設計師定價還是店家定價</label>
                                    <el-switch style="display: block;"
                                               v-model="form[index]['is_store_service']"
                                               :disabled="form[index]['orderType'] !== 'storeService'"
                                               active-color="#2dce89"
                                               inactive-color="#f5365c"
                                               active-text="商家定價"
                                               :active-value="1"
                                               :inactive-value="0"
                                               inactive-text="設計師定價">
                                    </el-switch>
                                </div>
                                <div>
                                    <label class="d-block"
                                           v-if="form[index]['orderType'] !== null">請選擇商品或技術</label>
                                    <el-select v-if="form[index]['orderType'] === 'storeService' && form[index]['is_store_service'] === 1"
                                               v-model="form[index]['orderTypeId']"
                                               clearable
                                               @change="serviceChange(index,form[index]['orderTypeId'])"
                                               placeholder="請選擇技術">
                                        <el-option v-for="(item, index) in serviceOptions['storeService']"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.service_id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-else-if="form[index]['orderType'] === 'storeService' && form[index]['is_store_service'] === 0"
                                               v-model="form[index]['orderTypeId']"
                                               clearable
                                               @change="serviceChange(index,form[index]['orderTypeId'])"
                                               placeholder="請選擇技術">
                                        <el-option v-for="(item, index) in serviceOptions['designerService']"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.service_id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-else-if="form[index]['orderType'] === 'commodity' && form[index]['is_store_service'] === 0"
                                               v-model="form[index]['orderTypeId']"
                                               clearable
                                               :disabled="checkEdit && form[index]['operator_info_order_id'] !== 0"
                                               @change="serviceChange(index,form[index]['orderTypeId'])"
                                               placeholder="請選擇商品">
                                        <el-option v-for="(item, index) in serviceOptions['commodity']"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.commodity_id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div>
                                    <span class="float-right">庫存數量: {{ commodityQuantity[index] }}</span>
                                    <label class="float-left">數量</label>
                                    <div class="clearfix"></div>
                                    <el-input type="number"
                                              :placeholder="'請輸入庫存數量'"
                                              :disabled="form[index]['orderType'] !== 'commodity' || checkEdit"
                                              v-model.number="form[index]['quantity']">
                                    </el-input>
                                </div>
                                <div>
                                    <label class="d-block">預購數量</label>
                                    <el-input type="number"
                                              :placeholder="'請輸入預購數量'"
                                              :disabled="form[index]['orderType'] !== 'commodity' || checkEdit"
                                              v-model.number="form[index]['pre_quantity']">
                                    </el-input>
                                </div>
                                <div v-if="form[index]['orderType'] === 'commodity'">
                                    <label class="d-block">銷售人員</label>
                                    <el-switch style="display: block;"
                                               v-model="form[index]['checkSellerUser']"
                                               active-color="#2dce89"
                                               inactive-color="#f5365c"
                                               active-text="設計師"
                                               :active-value="'designer'"
                                               :inactive-value="'assistant'"
                                               :disabled="form[index]['orderType'] !== 'commodity'"
                                               inactive-text="助理">
                                    </el-switch>
                                    <el-select v-if="form[index]['checkSellerUser'] === 'designer'"
                                               v-model="form[index]['seller_id']"
                                               :disabled="form[index]['orderType'] !== 'commodity'"
                                               clearable
                                               placeholder="請選擇銷售設計師">
                                        <el-option v-for="(item, index) in designerOptions"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.user.user_id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-else
                                               v-model="form[index]['seller_id']"
                                               clearable
                                               :disabled="form[index]['orderType'] !== 'commodity'"
                                               placeholder="請選擇銷售助理">
                                        <el-option v-for="(item, index) in assistantOptions"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.user.user_id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div>
                                    <label class="d-block">原定價</label>
                                    <el-input type="number"
                                              :placeholder="'請輸入定價'"
                                              v-model.number="form[index]['price']">
                                    </el-input>
                                </div>
                                <div>
                                    <label class="d-block">自定價</label>
                                    <el-input type="number"
                                              :placeholder="'請輸入自定價'"
                                              v-model.number="form[index]['preferential_price']">
                                    </el-input>
                                </div>
                                <div>
                                    <label class="d-block">抽成</label>
                                    <el-input type="number"
                                              :placeholder="'請輸入抽成%數'"
                                              v-model.number="form[index]['commission']">
                                    </el-input>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div>
                                    <label class="d-block">協助助理</label>
                                    <el-select v-model="form[index]['help_assistant_id']"
                                               clearable
                                               :disabled="form[index]['orderType'] === 'commodity'"
                                               placeholder="請選擇協助助理">
                                        <el-option v-for="(item, index) in assistantOptions"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.assistant_id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div>
                                    <label class="d-block">協助設計師</label>
                                    <el-select v-model="form[index]['help_designer_id']"
                                               :disabled="form[index]['orderType'] === 'commodity'"
                                               clearable
                                               placeholder="請選擇協助設計師">
                                        <el-option v-for="(item, index) in designerOptions"
                                                   v-show="item.designer_id !== formOrder['designer_id']"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.designer_id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-if="form[index]['help_assistant_id'] !== null && form[index]['help_assistant_id'] !== '' || form[index]['help_designer_id'] !== null && form[index]['help_designer_id'] !== '' ">
                                    <div v-if="(form[index]['help_designer_id'] !== null || form[index]['help_designer_id'] !== '') && (form[index]['help_assistant_id'] === null || form[index]['help_assistant_id'] === '')">
                                        <label class="d-block">設計師抽成</label>
                                        <el-input type="number"
                                                  :disabled="form[index]['orderType'] === 'commodity'"
                                                  :placeholder="'請輸入抽成%數'"
                                                  v-model.number="form[index]['help_designer_commission']">
                                        </el-input>
                                    </div>
                                    <div v-if="(form[index]['help_designer_id'] === null || form[index]['help_designer_id'] === '') && (form[index]['help_assistant_id'] !== null || form[index]['help_assistant_id'] !== '')">
                                        <label class="d-block">助理抽成</label>
                                        <el-input type="number"
                                                  :disabled="form[index]['orderType'] === 'commodity'"
                                                  :placeholder="'請輸入抽成%數'"
                                                  v-model.number="form[index]['help_assistant_commission']">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <el-input type="textarea"
                                      :placeholder="'備註'"
                                      v-model="form[index]['note']">
                            </el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-form v-if="formOrder.designer_id !== null"
                 ref="formOrder"
                 class="mt-2"
                 :model="formOrder">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <el-form-item label="結帳方式"
                                  prop="type"
                                  :rules="{ required: true, message: '請選擇結帳方式', trigger: 'change' }">
                        <el-select v-model="formOrder.type"
                                   class="w-100"
                                   placeholder="請選擇結帳方式">
                            <el-option v-for="(item, index) in typeOptions"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="col-md-3"
                     v-if="formOrder.type === 'creditCard'">
                    <el-form-item label="信用卡手續費"
                                  prop="type"
                                  :rules="{ required: true, message: '請輸入手續費%數', trigger: 'blur' }">
                        <el-input type="number"
                                  :placeholder="'請輸入手續費%數'"
                                  v-model.number="formOrder.creditcard_commission">
                        </el-input>
                    </el-form-item>
                </div>
                <div class="col-md-3">
                    <el-form-item label="訂單日期"
                                  prop="order_date"
                                  :rules="{ required: true, message: '請選擇訂單日期', trigger: 'change' }">
                        <el-date-picker v-model="formOrder.order_date"
                                        class="w-100"
                                        type="date"
                                        placeholder="選擇日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="col-md-3">
                    <el-form-item label="會員"
                                  prop="member_id"
                                  :rules="{ required: true, message: '請選擇會員', trigger: 'change' }">
                        <el-select v-model="formOrder.member_id"
                                   class="w-100"
                                   @change="memberChange(formOrder.member_id)"
                                   placeholder="請選擇會員">
                            <el-option v-for="(item, index) in memberOptions"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.member_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="col-md-3">
                    <el-form-item label="自定義價格"
                                  prop="preferential_price"
                                  class="w-100"
                                  :rules="{ required: true, message: '請輸入自定義價格', trigger: 'blur' }">
                        <el-input type="number"
                                  placeholder="請輸入自定義價格"
                                  v-model.number="formOrder.preferential_price">
                        </el-input>
                    </el-form-item>
                </div>
                <div class="col-md-3"
                     v-if="formOrder.type === 'point' && memberPoint !== null">
                    <h5>儲值卡剩餘點數: {{ memberPoint }}</h5>
                    <el-form-item label="儲值卡扣點"
                                  prop="point"
                                  :rules="{ required: true, message: '請輸入儲值卡扣點額度', trigger: 'blur' }">
                        <el-input type="number"
                                  class="w-100"
                                  placeholder="請輸入儲值卡扣點"
                                  v-model.number="formOrder.point">
                        </el-input>
                    </el-form-item>
                </div>
                <div class="col-md-3">
                    <el-form-item label="支付現金"
                                  prop="cash"
                                  class="w-100"
                                  :rules="{ required: true, message: '請輸入現金', trigger: 'blur' }">
                        <el-input type="number"
                                  placeholder="請輸入現金"
                                  v-model.number="formOrder.cash">
                        </el-input>
                    </el-form-item>
                </div>
                <div class="col-md-8">
                    <el-form-item label="訂單號備註"
                                  prop="note"
                                  :rules="{ required: true, message: '請輸入訂單備註', trigger: 'blur' }">
                        <el-input class="w-100"
                                  type="textarea"
                                  placeholder="請輸入訂單號備註"
                                  v-model="formOrder.note">
                        </el-input>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <div class="text-right mt-2">

            <div class="float-left">
                <button class="darkBtn borderRadius10 px-3 py-2 mb-2"
                        v-if="$route.meta.params.Create == 1 && (user.group.group_code !== 'SYSTEM' || $route.params.operatorId !== undefined)"
                        @click="onSubmit('formOrder')">
                    {{ submitText }}
                </button>
            </div>
            <div class="float-right">
                <span class="greenBg text-white p-2 borderRadius10 ml-1">折扣額度總計: {{ total - infoTotal | formatCurrency }}</span>
                <span class="hotBg text-white p-2 borderRadius10 ml-1">折價總計: {{ infoTotal | formatCurrency }}</span>
                <span class="darkBg text-white p-2 borderRadius10 ml-1">原價總計: {{ total | formatCurrency }}</span>
            </div>
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
// 取得商家訂單資料
/**
 * OperatorOrderDataApi = 取得商家訂單資料
 * UpdateOperatorOrderApi = 更新商家訂單資料
 * AddOperatorOrderApi = 新增商家訂單資料
 */
import { OperatorOrderDataApi, UpdateOperatorOrderApi, AddOperatorOrderApi } from "../../../api/operatorOrderApi";
// 取得可選擇商品列表
import { CommoditySelectListApi } from "../../../api/commodityApi";
/**
 * DesignerSelectListApi = 取得可選擇設計師列表
 * DesignerServiceSelectListsApi = 取得可選擇設計師服務
 */
import { DesignerSelectListApi, DesignerServiceSelectListsApi } from "../../../api/designerApi";
// 取得可選擇助理列表
import { AssistantSelectListApi } from "../../../api/assistantApi";
/**
 * OperatorUserDataApi = 取得管理者資料
 * OperatorServiceSelectListsApi = 取得管理者服務選擇
 */
import { OperatorUserDataApi, OperatorServiceSelectListsApi } from "../../../api/operatorApi";
// 取得可選擇會員列表
import { MemberSelectListApi } from "../../../api/memberApi";
// 導入 lodash 套件
import _ from "lodash";
export default {
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
        // 折扣總計
        infoTotal() {
            let self = this;
            let total = 0;
            self.form.forEach((item) => {
                if (item.preferential_price === 0) {
                    total += item.price * (item.quantity + item.pre_quantity);
                } else {
                    total += item.preferential_price * (item.quantity + item.pre_quantity);
                }
            });
            return total;
        },
        // 原價總計
        total() {
            let self = this;
            let total = 0;
            self.form.forEach((item) => {
                total += item.price * (item.quantity + item.pre_quantity);
            });
            return total;
        }
    },
    data() {
        return {
            // 商家訂單明細資料
            form: [],
            // 進貨單資料
            formOrder: {
                designer_id: null,
                preferential_price: 0,
                cash: 0
            },
            // 可選擇設計師
            designerOptions: [],
            // 可選擇助理
            assistantOptions: [],
            // 可選擇會員
            memberOptions: [],
            // 可選擇商品
            commodityOptions: [],
            // 結帳方式
            typeOptions: [
                {
                    value: "cash",
                    label: "現金"
                },
                {
                    value: "creditCard",
                    label: "信用卡"
                },
                {
                    value: "point",
                    label: "儲值卡"
                }
            ],
            // 訂單類型
            orderTypeOptions: [
                {
                    value: "commodity",
                    label: "商品"
                },
                {
                    value: "storeService",
                    label: "技術"
                }
            ],
            serviceOptions: {},
            // 判斷是否為更新
            checkEdit: false,
            // 商品數量統計
            commodityQuantity: [],
            // 會員點數
            memberPoint: null,
            // 預設表單值
            formDataDefault: [
                {
                    operator_info_order_id: 0,
                    is_store_service: 0,
                    title: null,
                    orderType: null,
                    orderTypeId: null,
                    quantity: 1,
                    pre_quantity: 0,
                    preferential_price: 0,
                    price: 0,
                    commission: 0,
                    help_designer_id: null,
                    help_assistant_id: null,
                    seller_id: null,
                    checkSellerUser: null,
                    note: null
                }
            ],
            loading: false
        };
    },
    filters: {
        showThead(value) {
            switch (value) {
                case "designer_id":
                    return "設計師";
                    break;
                case "help_designer_id":
                    return "協助設計師";
                    break;
                case "help_assistant_id":
                    return "協助人員";
                    break;
                case "quantity":
                    return "數量";
                    break;
                case "pre_quantity":
                    return "預購數量";
                    break;
                case "price":
                    return "消費";
                    break;
                case "preferential_price":
                    return "自定價";
                    break;
                case "commission":
                    return "抽成";
                    break;
                case "note":
                    return "備註";
                    break;
                case "seller_id":
                    return "銷售員";
                    break;
                case "orderType":
                    return "訂單類型";
                    break;
                case "orderTypeId":
                    return "訂單服務";
                case "title":
                    return "標題";
                    break;
                default:
                    return value;
                    break;
            }
        }
    },
    methods: {
        /**
         * 服務選擇時觸發事件
         * @param { type Number(數字) } index 陣列索引值
         * @param { type String or Number(字串或數字) } val 服務id
         */
        serviceChange(index, val) {
            let self = this;
            switch (true) {
                case self.form[index]["orderType"] === "commodity":
                    self.serviceOptions["commodity"].forEach((item) => {
                        if (val === item.commodity_id) {
                            let minQuantity = _.minBy(item.morph_to_many_product, (item2) => item2.quantity);
                            self.$set(self.commodityQuantity, index, minQuantity.quantity);
                            self.$set(self.form[index], "price", item.price);
                        }
                    });
                    break;
                case self.form[index]["orderType"] === "storeService" && self.form[index]["is_store_service"] === 0:
                    self.serviceOptions["designerService"].forEach((item) => {
                        if (val === item.service_id) {
                            self.$set(self.form[index], "price", item.store_service.store_service_info.price);
                        }
                    });
                    break;
                case self.form[index]["orderType"] === "storeService" && self.form[index]["is_store_service"] === 1:
                    self.serviceOptions["storeService"].forEach((item) => {
                        if (val === item.service_id) {
                            self.$set(self.form[index], "price", item.store_service.store_service_info.price);
                        }
                    });
                    break;
                default:
                    break;
            }
        },
        // 會員選擇時觸發事件
        memberChange(val) {
            let self = this;
            self.memberOptions.forEach((item) => {
                if (val === item.member_id) {
                    if (item.user_member_info !== null) {
                        self.memberPoint = item.user_member_info.point;
                    } else {
                        self.memberPoint = null;
                    }
                }
            });
        },
        /**
         * 選擇設計師時觸發事件
         * @param { type String or Number(字串或數字) } val 設計師id
         */
        designerChange(val) {
            let self = this;
            self.getCommodity(self.$route.params.operatorId);
            self.getOperatorService(self.$route.params.operatorId);
            self.getDesignerService(val);
        },
        /**
         * 新增欄位
         */
        addRow() {
            let self = this;
            // 儲存商家訂單明細傳送 key 變數
            let obj = {
                title: null,
                operator_info_order_id: 0,
                is_store_service: 0,
                orderType: null,
                orderTypeId: null,
                quantity: 1,
                pre_quantity: 0,
                preferential_price: 0,
                price: 0,
                commission: 0,
                help_designer_id: null,
                help_assistant_id: null,
                seller_id: null,
                checkSellerUser: null,
                note: null
            };
            // 將商家訂單上新增一個空的商家訂單明細欄位
            // self.products.push(obj);
            // 將表單傳送值上新增一個空的商家訂單明細欄位
            self.form.push(obj);
        },
        // 刪除多餘的商家訂單明細欄位
        deleteRow(index) {
            let self = this;
            self.form.splice(index, 1);
            self.products.splice(index, 1);
        },
        /**
         * 取得商家訂單單一資料
         * @param { type String or Number(字串或數字) } orderNumber 商家訂單號
         */
        async getData(orderNumber) {
            let self = this;
            self.getCommodity(self.$route.params.operatorId);
            self.getOperatorService(self.$route.params.operatorId);
            self.getDesignerService(self.$route.params.designerId);
            try {
                let { data } = await OperatorOrderDataApi(orderNumber);
                // 判斷支付方式為點數時
                if (data.data.type === "point") {
                    self.memberChange(data.data.member_id);
                }
                self.products = data.data.operator_info_order;
                self.form = data.data.operator_info_order;
                data.data.operator_info_order.forEach((item, index) => {
                    // 判斷商品銷售員為何人時
                    if (item.user !== null) {
                        if (item.user.userable.designer_id !== undefined) {
                            self.$set(self.form[index], "checkSellerUser", "designer");
                            self.$set(self.products[index], "checkSellerUser", "designer");
                        } else {
                            self.$set(self.form[index], "checkSellerUser", "assistant");
                            self.$set(self.products[index], "checkSellerUser", "assistant");
                        }
                    }
                    // 該筆商家訂單明細 id
                    self.$set(self.form[index], "orderTypeId", item.order_able_id);
                    // 該筆商家訂單明細 id
                    self.$set(self.products[index], "orderTypeId", item.order_able_id);
                    // 判斷此筆訂單類型
                    if (item.order_able_type === "App\\Models\\Commodity") {
                        // 取出取商品庫存數量
                        self.serviceOptions["commodity"].forEach((item2) => {
                            if (item.order_able_id === item2.commodity_id) {
                                let minQuantity = _.minBy(item2.morph_to_many_product, (item3) => item3.quantity);
                                self.$set(self.commodityQuantity, index, minQuantity.quantity);
                            }
                        });
                        // commodity 類型為販售商品訂單
                        self.$set(self.form[index], "orderType", "commodity");
                        self.$set(self.products[index], "orderType", "commodity");
                    } else {
                        // storeService 類型為消費服務訂單
                        self.$set(self.form[index], "orderType", "storeService");
                        self.$set(self.products[index], "orderType", "storeService");
                    }
                });
                // 商家訂單資料
                self.formOrder = {
                    title: data.data.title,
                    order_date: data.data.order_date,
                    order_note: data.data.note,
                    type: data.data.type,
                    preferential_price: data.data.preferential_price,
                    note: data.data.note,
                    cash: data.data.cash,
                    point: data.data.point,
                    creditcard_commission: self.form[0].creditcard_commission,
                    designer_id: data.data.designer_id,
                    member_id: data.data.member_id,
                    operator_id: data.data.operator_id,
                    operator_order_id: data.data.operator_order_id
                };
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得詳細資料失敗"
                });
            }
        },
        /**
         * 取得可選擇設計師
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getDesigner(operatorId) {
            let self = this;
            try {
                let { data } = await DesignerSelectListApi(operatorId);
                self.designerOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得設計師失敗"
                });
            }
        },
        /**
         * 取得可選擇助理
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getAssistant(operatorId) {
            let self = this;
            try {
                let { data } = await AssistantSelectListApi(operatorId);
                self.assistantOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得助理失敗"
                });
            }
        },
        /**
         * 取得可選擇會員
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getMember(operatorId) {
            let self = this;
            try {
                let { data } = await MemberSelectListApi(operatorId);
                self.memberOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得會員失敗"
                });
            }
        },
        /**
         * 取得可選擇商品
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getCommodity(operatorId) {
            let self = this;
            try {
                let { data } = await CommoditySelectListApi(operatorId);
                self.serviceOptions["commodity"] = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得商品失敗"
                });
            }
        },
        /**
         * 取得可選擇商家服務
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getOperatorService(operatorId) {
            let self = this;
            try {
                let { data } = await OperatorServiceSelectListsApi(operatorId);
                self.serviceOptions["storeService"] = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得店家服務失敗"
                });
            }
        },
        /**
         * 取得可選擇設計師服務
         * @param { type String or Number(字串或數字) } designerId 設計師id
         */
        async getDesignerService(designerId) {
            let self = this;
            try {
                let { data } = await DesignerServiceSelectListsApi(designerId);
                self.serviceOptions["designerService"] = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得設計師服務失敗"
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
            let sendData = self.formOrder;
            sendData["datas"] = self.form;
            sendData["order_date"] = moment(self.formOrder.order_date).format("YYYY/MM/DD HH:mm:ss");
            sendData["operator_id"] = self.$route.params.operatorId;
            sendData["user_id"] = self.user.user_id;
            try {
                await self.$refs[formName].validate();
                if (self.checkEdit) {
                    self.update(sendData);
                } else {
                    self.add(sendData);
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗"
                });
            }
        },
        // 更新商家訂單
        async update(form) {
            let self = this;
            self.loading = true;
            try {
                await UpdateOperatorOrderApi(form);
                self.loading = false;
                self.$message({
                    type: "success",
                    message: "更新成功"
                });
                // 重新取得資料
                self.getData(self.$route.params.orderNumber);
            } catch (err) {
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "更新失敗"
                });
            }
        },
        // 新增商家訂單
        async add(form) {
            let self = this;
            self.loading = true;
            try {
                await AddOperatorOrderApi(form);
                self.loading = false;
                self.$message({
                    type: "success",
                    message: "新增成功"
                });
                // 重新取得資料
                self.back();
            } catch (err) {
                self.loading = false;
                self.$message({
                    type: "error",
                    message: "新增失敗"
                });
            }
        },
        //返回列表
        back() {
            let self = this;
            self.$router.push({ name: "orderControl_operator_order_list" });
        }
    },
    created() {
        let self = this;
        self.getDesigner(self.$route.params.operatorId);
        self.getAssistant(self.$route.params.operatorId);
        self.getMember(self.$route.params.operatorId);
        if (self.$route.params.orderNumber !== undefined) {
            self.getData(self.$route.params.orderNumber);
            self.checkEdit = true;
        } else {
            // 預設表單key
            let arr = [
                {
                    operator_info_order_id: 0,
                    is_store_service: 0,
                    title: null,
                    orderType: null,
                    orderTypeId: null,
                    quantity: 1,
                    pre_quantity: 0,
                    preferential_price: 0,
                    price: 0,
                    commission: 0,
                    help_designer_id: null,
                    help_assistant_id: null,
                    seller_id: null,
                    checkSellerUser: null,
                    note: null
                }
            ];
            // 預設初始值 新增商家訂單預設需傳入key
            self.products = arr;
            // 預設初始值 新增商家訂單預設需傳入key
            self.form = arr;
        }
    }
};
</script>