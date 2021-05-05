<template>
    <div>
        <div class="text-center"
             v-if="datas.length === 0">沒有資料</div>
        <div v-for="(operator,key) in datas"
             :key="key"
             v-loading="loading"
             class="mt-3">
            <h1 class="hotBg text-white mb-0 py-2 text-center">{{ operator.operatorName }}</h1>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="hotBg text-center">
                        <tr class="text-center py-1">
                            <th class="text-white">#</th>
                            <th class="text-white">名稱</th>
                            <th class="text-white">職位</th>
                            <th class="text-white">薪水</th>
                            <th class="text-white">店販業績</th>
                            <th class="text-white">技術業績</th>
                            <th class="text-white">協助設計師業績</th>
                            <th class="text-white">總業績</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in datas[key]['data']"
                            :key="index">
                            <td>{{ index +1 }}</td>
                            <td>{{ item.name }}</td>
                            <td :class="item.type.key === 'designer' ? 'hot-color' : 'text-primary' ">{{ item.type.label }}</td>
                            <td class="text-right">{{ item.salary }}</td>
                            <td class="text-right font-weight-bold green-color">{{ item.commodityTotal | formatCurrency }}</td>
                            <td class="text-right font-weight-bold">
                                <ul v-if="item.designerServiceCategoryTotal !== null"
                                    class="list-unstyled">
                                    <li class="d-inline-block borderWidth1 ml-1 p-2 grayBorder text-dark"
                                        v-for="(category, key) in item.serviceCategoryTotal"
                                        :key="key">
                                        {{key | categoryKey}}: {{category}}
                                    </li>
                                </ul>
                                <h5 class="hot-color">技術業績總計: {{ item.serviceTotal | formatCurrency }}</h5>
                            </td>
                            <td class="text-right font-weight-bold">{{ item.helpTotal | formatCurrency }}</td>
                            <td class="text-right font-weight-bold red-color">{{ item.total | formatCurrency }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">總計</td>
                            <td class="font-lg font-weight-bold red-color text-right">{{ totalSum(datas[key]['data'], "salary") | formatCurrency }}</td>
                            <td class="font-lg font-weight-bold red-color text-right">{{ totalSum(datas[key]['data'], "commodityTotal") | formatCurrency }}</td>
                            <td class="font-lg font-weight-bold red-color text-right">{{ totalSum(datas[key]['data'], "serviceTotal") | formatCurrency }}</td>
                            <td class="font-lg font-weight-bold red-color text-right">{{ totalSum(datas[key]['data'], "helpTotal") | formatCurrency }}</td>
                            <td class="font-lg font-weight-bold red-color text-right">{{ totalSum(datas[key]['data'], "total") | formatCurrency }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
td {
    vertical-align: middle;
}
</style>
<script>
// 導入lodash套件
import _ from "lodash";
export default {
    filters: {
        categoryKey(key) {
            switch (key) {
                case "Perm":
                    return "燙髮";
                    break;
                case "Dye":
                    return "染髮";
                    break;
                case "Cut":
                    return "剪髮";
                    break;
                case "Shampoo":
                    return "洗髮";
                    break;
                case "Bangs":
                    return "修瀏海";
                    break;
                default:
                    return key;
                    break;
            }
        }
    },
    props: {
        // 列表資料
        datas: {
            type: [Object, Array],
            default: []
        },
        // 搜尋管理者資料
        searchOperator: {
            type: [String, Number],
            default: null
        },
        // loading事件
        loading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 計算總合
        totalSum(datas, key) {
            return _.sumBy(datas, (sum) => sum[key]);
        }
    }
};
</script>