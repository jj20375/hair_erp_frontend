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
                <el-form-item label="商品名稱"
                              prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="商品代碼"
                              prop="key">
                    <el-input v-model="form.key"></el-input>
                </el-form-item>
                <el-form-item label="銷售價格"
                              prop="price">
                    <el-input type="number"
                              v-model.number="form.price">
                        <template slot="prepend">$</template>
                    </el-input>
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
                <el-form-item label="選擇產品"
                              props="productIds">
                    <el-select v-model="form.productIds"
                               class="w-100"
                               multiple
                               placeholder="請選擇">
                        <el-option v-for="(item, index) in productOptions"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.product_id">
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
                            <label class="d-block">商品圖片</label>
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
                            <div>商品圖片</div>
                            <img class="rounded"
                                 width="200"
                                 :src="`${$gcsImgUrl}/${imgUrl}`">
                            <button @click.prevent="onDelete(form.commodity_id)"
                                    class="btn btn-danger">刪除圖片</button>
                        </el-form-item>
                    </el-col>
                </el-row>
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
<style lang="scss">
.zindex10000 {
    z-index: 10000;
}
</style>
<script>
import { mapState, mapGetters } from "vuex";
// 導入 lodash套件
import _ from "lodash";
// CategorySelectListApi = 取的可選擇的分類 api
import { CategorySelectListApi } from "../../api/categoryApi";
// 取的可選擇的標籤 api
import { TagSelectListApi } from "../../api/tagApi";
// 取的可選擇的產品 api
import { ProductSelectListByCommodityApi } from "../../api/productApi";
// 導入 sweetalert 套件
import Swal from "sweetalert2";
/**
 * AddCommodityApi = 新增商品 api
 * UpdateCommodityApi = 更新商品 api
 * CommodityDataApi = 取的商品資料 api
 * DeleteCommodityImageApi = 刪除商品圖片api
 */
import { AddCommodityApi, UpdateCommodityApi, CommodityDataApi, DeleteCommodityImageApi } from "../../api/commodityApi";
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
            // 可選擇分類代碼
            categoryOptions: [],
            // 可選擇標籤代碼
            tagOptions: [],
            // 可選擇產品代碼
            productOptions: [],
            // 驗證規則
            rules: {
                name: [
                    {
                        required: true,
                        message: "請輸入商品名稱",
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
                        message: "請輸入商品代碼",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 30,
                        message: "長度最少2個字最多30個字",
                        trigger: "blur"
                    }
                ],
                price: [
                    {
                        required: true,
                        message: "請輸入商品價格",
                        trigger: "blur"
                    },
                    {
                        type: "number",
                        message: "商品價格為數字",
                        trigger: "blur"
                    }
                ],
                productIds: [
                    {
                        required: true,
                        message: "請選擇廠商",
                        trigger: "change"
                    }
                ],
                category_id: [
                    {
                        required: true,
                        message: "請選擇分類",
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
        // 新增商品
        async add(form) {
            let self = this;
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(form).map((objKey) => {
                // 判斷是否有傳入 productIds
                if (objKey === "productIds") {
                    // 因為 productIds 需要以陣列方式傳送 因此 模擬 form表單發送時 需特別處理
                    form[objKey].forEach((item, index) => {
                        result.append(`${objKey}[${index}]`, item);
                    });
                } else if (objKey === "tagIds") {
                    // 因為 tagIds 需要以陣列方式傳送 因此 模擬 form表單發送時 需特別處理
                    form[objKey].forEach((item, index) => {
                        result.append(`${objKey}[${index}]`, item);
                    });
                } else {
                    result.append(objKey, form[objKey]);
                }
            });
            try {
                await AddCommodityApi(result);
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
        // 更新商品
        async update(form) {
            let self = this;
            // 模擬表單發送方式 因為需要上傳圖片
            let result = new FormData();
            // 回圈整理資料 模擬成表單發送
            Object.keys(form).map((objKey) => {
                // 判斷是否有傳入 productIds
                if (objKey === "productIds") {
                    // 因為 productIds 需要以陣列方式傳送 因此 模擬 form表單發送時 需特別處理
                    form[objKey].forEach((item, index) => {
                        result.append(`${objKey}[${index}]`, item);
                    });
                } else if (objKey === "tagIds") {
                    // 因為 tagIds 需要以陣列方式傳送 因此 模擬 form表單發送時 需特別處理
                    form[objKey].forEach((item, index) => {
                        result.append(`${objKey}[${index}]`, item);
                    });
                } else {
                    result.append(objKey, form[objKey]);
                }
            });
            try {
                await UpdateCommodityApi(result);
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
         * 刪除產品圖片
         * @param { type String or Number (字串或數字) } productId 商品id
         */
        async onDelete(productId) {
            let self = this;
            try {
                let { value } = await Swal.fire({
                    title: "請問是否刪除?",
                    customClass: {
                        container: "zindex10000"
                    },
                    html: `刪除資料：${productId}`,
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
                        await DeleteCommodityImageApi(self.imgUrl, productId);
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
                self.form.operator_id = self.operatorId;
                if (self.form.operator_ids === null) {
                    self.form.operator_ids = JSON.stringify([]);
                }
                // 判斷是否為更新
                if (self.checkEdit) {
                    self.form.commodity_id = self.formId;
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
         * 取得商品單一資料
         * @param { type String or Number(字串或數字) } commodityId 商品id
         */
        async getData(commodityId) {
            let self = this;
            try {
                let { data } = await CommodityDataApi(commodityId);
                self.form = {
                    name: data.data.name,
                    key: data.data.key,
                    price: data.data.price,
                    status: data.data.status,
                    operator_id: data.data.operator_id,
                    commodity_id: data.data.commodity_id,
                    category_id: data.data.category_id,
                    note: data.data.note,
                    tagIds: _.map(data.data.morph_to_many_tag, "tag_id"),
                    productIds: _.map(data.data.morph_to_many_product, "product_id")
                };
                // 選中的管理者id
                self.defaultCheckedKeys = data.data.operator_ids === null ? [] : JSON.parse(data.data.operator_ids);
                if (data.data.image !== null) {
                    self.imgUrl = data.data.image.img_path;
                }
            } catch (err) {
                console.log(err);
                self.$message({
                    type: "error",
                    message: "取得詳細資料失敗"
                });
            }
        },
        /**
         * 取得分類可選擇選單
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
         * 取得產品可選擇選單
         * @param { type String or Number(字串或數字) } operatorId 管理者id
         */
        async getProduct(operatorId) {
            let self = this;
            try {
                let { data } = await ProductSelectListByCommodityApi(operatorId);
                self.productOptions = data.data;
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得廠商失敗"
                });
            }
        },
        /**
         * 取得標籤可選擇選單
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
                self.getData(self.formId);
                self.getCategory("COMMODITY", self.operatorId);
                self.getTag("COMMODITY", self.operatorId);
                self.getProduct(self.operatorId);
            } else {
                let operatorId = self.$route.params.operatorId === undefined ? self.getOperatorId : self.$route.params.operatorId;
                self.getCategory("COMMODITY", parseInt(operatorId));
                self.getTag("COMMODITY", parseInt(operatorId));
                self.getProduct(self.operatorId);
            }
            self.getOperatorTreeLists(self.getOperatorId);
        }
    }
};
</script>
