import axios from "../config/httpConfig";
import { apiConfig } from "../../env";


// 取得伺服器時間
export const GetServerTimeApi = () => {
    return axios.get(`${apiConfig}/user/serverTime`);
};