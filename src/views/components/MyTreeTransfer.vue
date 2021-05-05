<template>
    <div>
        <el-button type="info"
                   :disabled="checkClickResetAgentData"
                   @click="transferReset()">重整代理資料</el-button>
        <span class="text-danger">如果有發現選擇時 無法找到要選擇的代理在點擊此按鈕</span>
        <TreeTransfer :from_data='fromData'
                      :to_data='toData'
                      :defaultProps="{label:'label', id: 'value'}"
                      @addBtn='add'
                      @removeBtn='remove'
                      @left-check-change="checkTransferLeftData"
                      :mode='mode'
                      height='540px'
                      filter
                      :defaultTransfer="false"
                      :defaultCheckedKeys="defaultCheckedKeys"
                      :high-light="true"
                      :checkStrictly="getCheckStrictly"
                      openAll />

        <!-- {{fromData}} -->
        <!-- <MenuList :tree="fromData"
        :selected="selected"
                  @onClick="onClick" />

        <h5>{{selected}}</h5> -->
    </div>
</template>

<script>
// 樹形穿梭匡
import TreeTransfer from "../../components/TreeTransfer.vue";
import MenuList from "../components/MenuList.vue";
export default {
    components: {
        TreeTransfer,
        MenuList,
    },
    props: {
        // 穿梭框左側資料
        fromData: {
            type: Array,
        },
        // 穿梭框右側資料
        toData: {
            type: Array,
        },
        // 預設選中的資料
        defaultCheckedKeys: {
            type: Array,
        },
        // 判斷穿梭框是否關聯子代理 也就是 選擇上層代理 連帶選擇下層
        checkStrictly: {
            type: Boolean,
            default: true,
        },
        // 判斷是否有點擊重取代理按鈕
        checkClickResetAgentData: {
            type: Boolean,
        },
    },
    computed: {
        getCheckStrictly() {
            let self = this;
            return self.checkStrictly;
        },
    },
    data() {
        return {
            // 預設穿梭框樣式
            mode: "transfer",
            selected: [],
        };
    },
    methods: {
        // 判斷穿梭框左側值是否有更新
        checkTransferLeftData(nodeObj, treeObj, checkAll) {
            let self = this;
            self.$emit("onCheckTransferLeftData", nodeObj, treeObj, checkAll);
        },
        // 將穿梭框左側資料加入右側方法
        add(fromData, toData, obj) {
            let self = this;
            self.$emit("onAdd", fromData, toData, obj);
        },
        // 將穿梭框右側資料加入左側方法
        remove(fromData, toData, obj) {
            let self = this;
            self.$emit("onRemove", fromData, toData, obj);
        },
        transferReset() {
            let self = this;
            self.$emit("onTransferReset");
        },
        onClick(val) {
            let self = this;
            // console.log(val);
            // if (self.selected.length > 0) {
            //     self.selected.forEach(item => {
            //         console.log(val, item);
            //         if (item !== val) {
            //             self.selected.push(val);
            //         }
            //     });
            //     return;
            // }
            self.selected.push(val);
        },
    },
};
</script>