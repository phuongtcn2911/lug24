import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// (Tùy chọn) — Thêm interceptor để log lỗi hoặc xử lý token sau này
api.interceptors.response.use(
    function (response) {
        // Nếu API trả về thành công (status 200, 201,...)
        // thì cho phép kết quả đi tiếp (return lại response)
        return response;
    },

    function (error) {
        // Nếu API trả về lỗi (status 400, 404, 500,...)
        // thì khối này sẽ chạy

        // In ra console thông tin lỗi để dễ debug
        if (error.response) {
            // error.response tồn tại nghĩa là server có trả về phản hồi (vd: lỗi 404, 500,...)
            console.error("API Error:", error.response.data);
        } else {
            // error.response không có nghĩa là request bị chặn hoặc mất mạng
            console.error("Network Error:", error.message);
        }

        // Trả lỗi ra ngoài để phần gọi axios biết mà xử lý (ví dụ hiển thị thông báo)
        return Promise.reject(error);
    }
);

export default api;