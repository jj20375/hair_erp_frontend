let UserRule = {
    // 帳號驗證
    FormUserAccountRule(rule, value = [], callback) {
        if (value.length === 0) {
            callback(new Error("請輸入帳號"));
        } else if (value.length < 5 || value.length > 20) {
            callback(new Error("帳號最少5位數最多20位數"));
        } else {
            callback();
        }
    },
    // 密碼驗證
    FormPasswordRule(rule, value = [], callback) {
        if (value.length === 0) {
            callback(new Error("請輸入密碼"));
        } else if (value.length < 3) {
            callback(new Error("密碼最少3位數"));
        } else {
            callback();
        }
    },
    // 密碼確認
    FormCheckPassRule(rule, value = [], callback) {
        if (value.length === 0) {
            callback(new Error("請輸入密碼"));
        } else if (value.length < 3) {
            callback(new Error("密碼最少3位數"));
        } else {
            callback();
        }
    },
    // 名稱確認
    FormNameRule(rule, value = [], callback) {
        if (value.length === 0) {
            callback(new Error("請輸入名稱"));
        } else if (value.length < 3 || value.length > 20) {
            callback(new Error("名稱限定3~20個字"));
        } else {
            callback();
        }
    },
    // email 確認
    FormEmailRule(rule, value = [], callback) {
        let re = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if (value.length === 0) {
            callback(new Error("請輸入信箱"));
        } else if (!re.test(value)) {
            callback(new Error("請輸入正確信箱格式"));
            // ^\w+：@ 之前必須以一個以上的文字&數字開頭，例如 abc
            // ((-\w+)：@ 之前可以出現 1 個以上的文字、數字或「-」的組合，例如 -abc-
            // (\.\w+))：@ 之前可以出現 1 個以上的文字、數字或「.」的組合，例如 .abc.
            // ((-\w+)|(\.\w+))*：以上兩個規則以 or 的關係出現，並且出現 0 次以上 (所以不能 –. 同時出現)
            // @：中間一定要出現一個 @
            // [A-Za-z0-9]+：@ 之後出現 1 個以上的大小寫英文及數字的組合
            // (\.|-)：@ 之後只能出現「.」或是「-」，但這兩個字元不能連續時出現
            // ((\.|-)[A-Za-z0-9]+)*：@ 之後出現 0 個以上的「.」或是「-」配上大小寫英文及數字的組合
            // \.[A-Za-z]+$/：@ 之後出現 1 個以上的「.」配上大小寫英文及數字的組合，結尾需為大小寫英文
        } else {
            callback();
        }
    },
    // 名稱確認
    FormRule(rule, value = [], callback) {
        if (value.length === 0) {
            callback(new Error("請輸入值或選擇"));
        }
    },
};

export default UserRule;
