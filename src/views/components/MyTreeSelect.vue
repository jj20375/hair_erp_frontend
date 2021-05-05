<template>
    <div style="min-height: 500px;">
        <div class="mt-2"><h5>選擇管理者</h5></div>
        <treeselect v-model="selected"
                    :clearable="true"
                    :alwaysOpen="defaultCheckedKeys.length > 0 ? false : true"
                    :autoSelectDescendants="true"
                    :flat="true"
                    :multiple="true"
                    :clearOnSelect="true"
                    :defaultExpandLevel="10"
                    :showCount="true"
                    :maxHeight="400"
                    :openDirection="'bottom'"
                    :normalizer="changeKey"
                    @input="onSelected"
                    :options="treeData" />
        <div class="mb-9"></div>
    </div>
</template>
<script>
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    props: {
        defaultCheckedKeys: {
            type: Array,
            default: []
        },
         // 樹狀選取框資料
        treeData: {
            type: Array,
        },
        keyDatas: {
            
        }
    },
    components: {
        Treeselect
    },
    data() {
        return {
            selected: []
        }
    },
    methods: {
        onSelected(val, id) {
            let self = this;
            self.$emit("onSelected", val);
        },
        // 更換key 因為 treeselect 預設為 label 是顯示值 id 為選中值 因為資料庫回傳欄位不同 key 因此需作轉換
        changeKey(node) {
            return {
                id: node.operator_id,
                label: node.name,
                children: node.children,
            }
        },
    },
    watch: {
        defaultCheckedKeys(val) {
            let self = this;
            self.selected = val;
        }
    },
    created() {
        let self = this;
        self.selected = self.defaultCheckedKeys;
    },
}
</script>