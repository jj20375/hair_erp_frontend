// 判斷是否為開發
let dev = true;
// api 連線網址
export const apiConfig = dev ? "http://adminapi.fuckbackend.com" : "https://adminapi.denhatbet.net";
// 網址是否有 "#" 字號 
export const setIndexMode = false;
// export const setIndexMode = true;
//對應域名設定
// export const setHost = "adminapi.denhatbet.net";
// google cloud storage 圖片路徑
export const gcsImgUrl = "";
// 編輯器key
export const tinymceApiKey = "e4iid0lku8kjo6en1vngnpv01ldu76o32q012cktzca9c3xv";
// 預設語系檔
export const defaultLanguage = "tw";
// 測試系統人員才看得到按鈕
export const systemShow = true;