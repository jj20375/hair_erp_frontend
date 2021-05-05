<template>
    <div>
        <base-header :type="'hotBg lightHotBorder borderTopWidth2'"
                     class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-12">
                    <Breadcrumb class="breadcrumb" />
                    <h6 class="h2 text-white d-inline-block mb-0">
                        {{ $route.meta.text }}
                    </h6>
                </div>
            </div>
        </base-header>
        <div class="container-fluid mt--5">
            <div class="row starter-page justify-content-center">
                <card class="col-12 col-md-8 shadow-lg">
                    <el-form :label-position="'right'"
                             :model="form"
                             status-icon
                             :rules="rules"
                             ref="form"
                             label-width="100px">
                        <el-form-item label="帳號"
                                      prop="account">
                            <el-input v-model="form.account"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="密碼"
                                      prop="password">
                            <el-input type="password"
                                      v-model="form.password"
                                      autocomplete="off"></el-input>
                            <span class="text-warning">有需要更新再輸入</span>
                        </el-form-item>
                        <el-form-item label="請確認密碼"
                                      prop="checkPass">
                            <el-input type="password"
                                      v-model="form.checkPass"
                                      autocomplete="off"></el-input>
                            <span class="text-warning">有需要更新再輸入</span>
                        </el-form-item>
                        <el-form-item label="名稱"
                                      prop="name">
                            <el-input v-model="form.name"
                                      placeholder="請輸入名稱"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary"
                                       native-type="submit"
                                       @click.prevent="onSubmit('form')">
                                更新
                            </el-button>
                        </el-form-item>
                    </el-form>
                </card>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Breadcrumb from "../components/Breadcrumb.vue";
//
/**LoginUserInfoApi = 取得登入使用者資料 api
 * UserUpdateApi = 更新使用者資料 api
 */
import { LoginUserInfoApi, UserUpdateApi } from "../../api/userApi";
export default {
    components: {
        Breadcrumb
    },
    data() {
        let self = this;
        return {
            form: { name: null },
            rules: {
                password: [
                    {
                        validator: self.formPassRule,
                        trigger: "blur"
                    }
                ],
                checkPass: [
                    {
                        validator: self.formCheckPassRule,
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "請輸入名稱",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapState("i18nStore", ["langData"]),
        ...mapState("userStore", ["user"])
    },
    methods: {
        // 判斷密碼確認是否輸入一樣
        formCheckPassRule(rule, value, callback) {
            let self = this;
            if (value === "") {
                callback(new Error("請再次輸入密碼"));
            } else if (value !== self.form.password) {
                callback(new Error("請確認兩次密碼輸入一致!"));
            } else {
                callback();
            }
        },
        // 判斷是否有輸入密碼
        formPassRule(rule, value, callback) {
            let self = this;
            if (value !== undefined) {
                if (!value) {
                    callback(new Error("請輸入密碼"));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        },
        /**
         * 表單發送
         * @param { type String(字串) } formName 傳送表單名稱
         * @example ref="form"
         */
        async onSubmit(formName) {
            let self = this;
            try {
                // 等待表單驗證是否成功 try catch 會自動判斷是 true 或 false 因次不用寫 if 判斷
                await self.$refs[formName].validate();
                self.update(self.form);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗"
                });
            }
        },

        /**
         * 取得登入者資料
         * @param { type Number or String (數字或字串) } userId
         */
        async getUserData(userId) {
            let self = this;
            try {
                let { data } = await LoginUserInfoApi(userId);
                self.form.user_id = data.data.user_id;
                self.form.csrf = data.data.csrf;
                self.form.account = data.data.account;
                self.$set(self.form, "name", data.data.userable.name);
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "取得使用者資料失敗"
                });
            }
        },
        async update(form) {
            let self = this;
            try {
                let { data } = await UserUpdateApi(form);
                console.log(data);
                self.$message({
                    type: "success",
                    message: "更新成功"
                });
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "更新失敗"
                });
            }
        }
    },
    created() {
        let self = this;
        self.getUserData(self.user.userId);
    }
};
</script>