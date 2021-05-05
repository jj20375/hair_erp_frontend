// 日期轉換套件
import moment from "moment";
export default {
    data() {
        return {
            // 日期套件時間
            dateValue: null,
            // 起始時間
            startTime: null,
            // 結束時間
            endTime: null,
        };
    },
    methods: {
        // 如果有搜尋日其實就觸發
        checkSelectDate(val) {
            let self = this;
            self.dateValue = val;
            if (self.dateValue !== null) {
                self.startTime = moment(self.dateValue[0]).format("YYYY-MM-DD HH:mm:ss");
                self.endTime = moment(self.dateValue[1]).format("YYYY-MM-DD HH:mm:ss");
            }
        },
    },
};
