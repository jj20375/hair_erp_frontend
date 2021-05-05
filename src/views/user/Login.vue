<template>
    <div class="container-fluid"
         style="height: 100vh;">
        <div class="row justify-content-center align-items-center"
             :style="bgStyle">
            <div class="col-12 col-md-5">
                <b-card no-body
                        class="mb-3 overflow-hidden redShadow">
                    <b-row no-gutters
                           align-v="stretch">
                        <b-col md="12"
                               lg="12"
                               cols="12"
                               align-self="center"
                               class="hotBg logoStyle">
                            <!-- <b-card-img :src="'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png'"
                                        alt="Image"
                                        class="rounded-0 w-75 mx-auto d-block align-middle"></b-card-img> -->
                            <h1 class="text-white m-0 p-3">美髮ERP</h1>
                        </b-col>
                        <b-col md="12"
                               lg="12"
                               cols="12"
                               class="bg-white">
                            <b-card-body>
                                <b-card-title class="text-center text-white"></b-card-title>
                                <el-form :label-position="labelPosition"
                                         :model="form"
                                         status-icon
                                         :rules="rules"
                                         ref="form"
                                         label-width="100px">
                                    <el-form-item label="帳號"
                                                  prop="account">
                                        <el-input v-model="form.account"
                                                  placeholder="請輸入帳號"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密碼"
                                                  prop="password">
                                        <el-input type="password"
                                                  v-model="form.password"
                                                  autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                    <button class="hotBtn borderRadius10 px-3 py-1"
                                                   type="submit"
                                                   @click.prevent="onSubmit('form')">登入</button>
                                        <b-dropdown id="dropdown-dropleft"
                                                    dropleft
                                                    text="Drop-Left"
                                                    size="sm"
                                                    variant="link"
                                                    toggle-class="text-danger"
                                                    menu-class="w-100">
                                            <template #button-content>
                                                <country-flag class="align-middle"
                                                              :country="showLang"
                                                              size="normal"></country-flag>
                                            </template>
                                            <b-dropdown-item link-class="d-inline-block animated fadeIn"
                                                             @click.prevent="getLang(item.lang)"
                                                             v-for="(item, index) in langs"
                                                             :key="index">
                                                <country-flag class="align-middle"
                                                              :country="item.icon"
                                                              size="normal"></country-flag>
                                            </b-dropdown-item>
                                        </b-dropdown>
                                    </el-form-item>
                                </el-form>

                            </b-card-body>
                        </b-col>
                    </b-row>

                </b-card>
            </div>
        </div>
    </div>
</template>
<script>
// 導入logo 圖示
import Bg from "../../assets/img/bg.jpg";
import Logo from "../../assets/logo.png";
// 使用 swwetalert2 套件
import Swal from "sweetalert2";
// 導入 vuex
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
// 導入 localStorage 設定值方法
import { setStorage } from "../../service/localStorage";
// 導入 使用者登入api連結
import { LoginApi } from "../../api/userApi";
// 導入 表單驗證
import UserRule from "../../requests/userRules";
export default {
    data() {
        return {
            labelPosition: "left",
            form: {
                account: "",
                password: "",
            },
            rules: {
                account: [
                    {
                        required: true,
                        // validator: UserRule.FormUserAccountRule,
                        trigger: "blur",
                        message: "請輸入帳號",
                    },
                ],
                password: [
                    {
                        required: true,
                        // validator: UserRule.FormPasswordRule,
                        trigger: "blur",
                        message: "請輸入密碼",
                    },
                ],
            },
            Logo,
            bgStyle: {
                height: "100%",
                backgroundImage: "url(" + Bg + ")",
                backgroundSize: "100% 100%",
                backgroundPosition: "auto 100%",
            },
        };
    },
    computed: {
        ...mapState("i18nStore", { locale: "locale" }),
        ...mapGetters("i18nStore", ["langs"]),
        showLang() {
            let self = this;
            switch (self.locale) {
                case "en":
                    return "us";
                    break;

                default:
                    return self.locale;
                    break;
            }
        },
    },
    methods: {
        ...mapActions("userStore", ["getLoginUserInfo"]),
        ...mapActions("i18nStore", ["getLang"]),
        ...mapMutations("userStore", ["setIsAuth"]),
        async onSubmit(formName) {
            let self = this;
            try {
                await self.$refs[formName].validate();
                try {
                    let res = await LoginApi(self.form);
                    await Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "登入成功",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    self.setIsAuth(true);
                    setStorage("isAuth", true);
                    // ajax 取得token
                    const { token } = res.data.data;
                    let loginTime = parseInt(res.data.data.unixtime) - 60 * 15;
                    // 將token儲存在localStorage
                    setStorage("token", "Bearer " + token);
                    setStorage("loginTime", loginTime);
                    try {
                        // await self.getLoginUserInfo();
                        self.$router.push({ name: "dashboard" }).catch(e => {});
                    } catch (err) {
                        console.log(err);
                        self.$message({
                            type: "error",
                            message: "取得使用者資料失敗",
                        });
                    }
                } catch (err) {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "登入失敗",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } catch (err) {
                self.$message({
                    type: "error",
                    message: "表單驗證失敗",
                });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "src/scss/var";
/deep/ .el-card {
    overflow: visible;
}
/deep/ .dropdown-menu {
    min-width: 250px;
    li {
        display: inline-block;
        padding: 0;
        a {
            padding: 0;
        }
    }
}
/deep/ .el-form-item__label {
    color: $hot-color;
}
.redShadow {
    box-shadow: 10px 10px 30px $light-hot-color;
}
.logoStyle {
    text-align: center;
    @media screen and (max-width: 768px) {
        text-align: center;
        border-left: none;
    }
}
</style>