import axios from "../config/httpConfig";
import { apiConfig } from "../../env";

/**
 * 客製化圖片上傳
 * @param { type Object(物件) } data
 * @example {
 * folderPath: 檔案目錄路徑 type String
 * imgFile: 圖片檔案 type File
 * }
 */
export const CustomImageUploadApi = (data) => {
    return axios.post(`${apiConfig}/image/customUpload`, data);
};
