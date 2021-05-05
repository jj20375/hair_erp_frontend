export const isEmpty = (value) => {
    return value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);
};
//判斷變數是否存在，可連函數也一起判斷
export const isSet = (value) => {
    try {
        //console.log(value+(typeof value?'1':0));
        return typeof value() !== "undefined" ? true : false;
    } catch (e) {
        return false;
    }
};
//判斷變數是否為NULL
export const isNull = (value) => {
    return typeof value === "undefined" || value == null || value == "null" ? true : false;
    /*
    try {
        return (typeof value() === "undefined") || value == "null"  ? true : false;
    } catch (e) {
        return true;
    }
     */
};
//產生隨機數
export const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
// 用於新增vuetable哪些需要排序以及排序方式
export let vueTableSortField = (name, direction) => {
    let arr = [];
    name.forEach((item, index) => {
        arr.push({ sortField: item, direction: direction[index] });
    });
    return arr;
};
// 貨幣判斷三位數增加逗號
export let formatCurrency = function(num) {
    let result = Math.floor(num * 100) / 100;
    return result.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function(all, pre, groupOf3Digital) {
        return pre + groupOf3Digital.replace(/\d{3}/g, ",$&");
    });
};
/**
 * @param { type = Array  傳入要搜尋條件得陣列值 } val
 * @param { type = Array  傳入要搜尋條件所匹配的key } key
 * @param { type = String 傳入要回傳的物件變數 } objVar
 */
export const checkHaveSelectData = function(val, key, objVar) {
    let self = this;
    val.forEach((item, index) => {
        if (item === null || item === "") {
            delete objVar[key[index]];
        } else {
            objVar[key[index]] = item;
            return objVar;
        }
    });
};
/**
 * 清除 _ 下劃線方法 只保留下劃線後字串
 * @param { 要過濾的字串 } val
 */
export const regexUnderLineString = (val) => {
    let delLength = val.indexOf("_") + 1;
    return val.substring(delLength, val.length);
};

export const arrayToTree = (array = [], options = { id: "id", pid: "pid", children: "children" }) => {
    let array_ = []; // 创建储存剔除叶子节点后的骨架节点数组
    let unique = {}; // 创建盒子辅助本轮children合并去重
    array.forEach((item) => {
        // 适应el-tree-transfer 将根节点pid重置为 0
        let root = ["undefined", undefined, null].includes(item[options.pid]);
        if (root) item[options.pid] = 0;
        // 筛选可以插入当前节点的所有子节点
        let children_array = array.filter((it) => it[options.pid] === item[options.id]);
        if (item.children && item.children instanceof Array) {
            // 去重合并数组
            item.children.map((i) => (unique[i[options.id]] = 1));
            item.children.push(...children_array.filter((i) => unique[i[options.id]] !== 1));
        } else {
            item.children = children_array;
        }
        // 当children_array有数据时插入下一轮array_，当无数据时将最后留下来的根节点树形插入数组
        let has_children = children_array.length > 0;
        if (has_children || (!has_children && [0, "0"].includes(item[options.pid]))) {
            array_.push(item);
        }
    });
    // 当数组内仅有根节点时退出，否组继续处理 最终递归深度次
    if (!array_.every((item) => [0, "0"].includes(item[options.pid]))) {
        return arrayToTree(array_, options);
    } else {
        return array_;
    }
};

/**
 * 判斷語系檔 是否存在 不存在則回傳key
 * @param { type Object (物件) 該值為語系檔的值} value
 * @param { type String (字串) 該值為檔案名稱 } langFile
 * @param { type String (字串) 該值為要傳入對應語系檔得key } langKey
 */
export const checkLang = function(value, langFile, langKey) {
    if (value !== null) {
        if (value[langFile] !== null && value[langFile] !== undefined) {
            if (value[langFile][langKey] === undefined) {
                return langKey;
            } else {
                return value[langFile][langKey].name;
            }
        } else {
            return "連語系檔都還沒有";
        }
    }
};