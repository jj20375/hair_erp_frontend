<template>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="pageSizes"
                   :page-size="paginationData.perPage"
                   :pager-count="5"
                   :layout="isMobile ? 'total, sizes, prev, next' : 'total, sizes, prev, pager, next, jumper'"
                   :total="paginationData.total">
    </el-pagination>
</template>

<script>
export default {
    props: {
        paginationData: {
            type: Object,
            default: {
                perPage: 15,
                total: 0,
            },
        },
        currentPage: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            // 每頁比數選擇
            pageSizes: [1, 2, 10, 15, 50, 100],
        };
    },
    methods: {
        // 切換每頁顯示筆數
        handleSizeChange(val) {
            let self = this;
            self.getDatas(val, true);
        },
        // 當分頁切換時觸發ajax 撈取新分頁資料
        handleCurrentChange(val) {
            let self = this;
            self.getDatas(val, false);
        },
        getDatas(val, pageSize) {
            let self = this;
            self.$emit("onGetDatas", val, pageSize);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../scss/var";
.el-pagination /deep/ .el-pagination__total {
    @media screen and (max-width: 767px) {
        display: block;
    }
}
.el-pagination /deep/ .el-pagination__sizes {
    margin-bottom: 20px;
    @media screen and (max-width: 767px) {
        display: block;
        width: 100%;
        margin: 10px 0 40px 0;
    }
}
/deep/ .el-select {
    @media screen and (max-width: 767px) {
        width: 100%;
    }
}
.el-pagination /deep/ .el-select .el-input {
    @media screen and (max-width: 767px) {
        width: 100%;
        margin: 0;
    }
}
/deep/ .el-input__inner {
    height: 30px;
}
/deep/ .el-pagination__total {
    color: $black-blue-color;
}
/deep/ .el-pager li {
    background-color: rgba(0, 0, 0, 0);
    border: 2px solid $hot-color;
    height: calc(1.5em + 1.25rem + 2px);
    line-height: 35px;
    border-radius: 5px;
    margin-left: 5px;
}
/deep/ .el-pager li.active {
    background-color: $hot-color;
    color: #fff;
    border: none;
}
/deep/ .el-pager .number {
    color: $hot-color;
}
/deep/ .el-pager li.btn-quickprev {
    color: $hot-color;
}
/deep/ .el-pager li.btn-quicknext {
    color: $hot-color;
}
.el-pagination /deep/ .btn-prev {
    background-color: $hot-color;
    border-radius: 0.3rem;
    border: 2px solid $hot-color;
    height: calc(1.5em + 1.25rem + 2px);
    padding: 15px;
    color: #fff;
    margin-right: 10px;
    width: 100px;
    cursor: pointer;
}
.el-pagination /deep/ .btn-next {
    background-color: $hot-color;
    border-radius: 0.3rem;
    border: 2px solid $hot-color;
    height: calc(1.5em + 1.25rem + 2px);
    padding: 15px;
    color: #fff;
    margin-left: 10px;
    width: 100px;
    cursor: pointer;
}
.el-pagination /deep/ button:disabled {
    border: 2px solid $gray-color;
    background-color: $gray-color;
    height: calc(1.5em + 1.25rem + 2px);
    color: darken($gray-color, 20%);
    padding: 15px;
    cursor: no-drop;
}
/deep/ .el-input__inner {
    background-color: rgba(255, 255, 255, 0);
    border: 2px solid $hot-color;
    color: $hot-color;
}
/deep/ .el-select .el-input .el-select__caret {
    color: $hot-color;
}
/deep/ .el-pager li.active + li {
    border: 2px solid $hot-color;
}
</style>