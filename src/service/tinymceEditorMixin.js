import { CustomImageUploadApi } from "../api/imageApi";
/**
 * tinymceApiKey = 編輯器key
 * gcsImgUrl = google cloust storage 網址路徑
 */
import { tinymceApiKey, gcsImgUrl } from "../../env";
export default {
    data() {
        let self = this;
        return {
            // 編輯器key
            tinymceApiKey,
            //  圖片資料夾路徑
            folderPath: "",
            // 編輯器設定值
            tinymceInit: {
                height: 500,
                menubar: false,
                plugins: ["link", "save", "image", "code", "imagetools", "fullscreen", "lists"],
                toolbar:
                    "undo redo | formatselect | bold italic forecolor backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | \
                    link | fullscreen | image | code",
                save_onsavecallback: true,
                file_picker_types: "image",
                automatic_uploads: true,
                // 編輯器圖片上傳方法
                images_upload_handler: function(blobInfo, success, failure) {
                    var result = new FormData();
                    // 檔案目錄路徑
                    result.append("folderPath", self.folderPath);
                    // 圖片檔案
                    result.append("imgFile", blobInfo.blob());
                    CustomImageUploadApi(result)
                        .then(({ data }) => {
                            console.log(data.data);
                            success(gcsImgUrl + "/" + data.data);
                        })
                        .catch((err) => {
                            console.log(err);
                            failure("上傳圖片失敗");
                        });
                },
            },
        };
    },
};
