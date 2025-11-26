export function ScanOrder() {
    return (

        <div id="internet" className="h-full bg-white tab-content block p-4 content-center">
            <input
                type="text"
                placeholder="Nhập mã hợp đồng Internet/TV"
                className="w-full border rounded-lg px-4 py-2 mb-3"
            />
            <button
                className="w- bg-gray-300 text-white py-2 rounded-lg cursor-not-allowed">
                Lấy mã OTP
            </button>
        </div>
    )
}