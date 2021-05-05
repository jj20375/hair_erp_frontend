// 設置localStorage
export const setStorage = function(key, obj) {
    let json = JSON.stringify(obj);
    window.sessionStorage.setItem(key, json);
};

// 獲取localStorage
export const getStorage = function(key) {
    const str = window.sessionStorage.getItem(key);
    if (!str || str === "undefined") {
        return null;
    }
    return JSON.parse(str);
};

// 移除localStorage
export const removeStorage = function(key) {
    window.sessionStorage.removeItem(key);
};
