export default function FaceVerifyGuide({onClick}) {

    return (
        <>
            <div className="w-[400px] h-[500px] 
            grid grid-rows-[auto_1fr_auto] gap-6
            bg-gray-50 border-gray-300 p-5 rounded-lg">
                <div className="flex justify-center justify-between shrink-0 pb-4">
                    <h1 className="text-2xl font-bold text-heading uppercase text-center mt-3">
                        Hướng dẫn xác thực gương mặt
                    </h1>
                </div>
                <div className="flex items-center">
                    <ul className="space-y-3 px-10 text-body list-disc list-outside marker:mr-5 text-justify">
                        <li>Vui lòng cởi bỏ khẩu trang, kính râm và nón.</li>
                        <li>Nhìn thẳng vào ống kính và thực hiện theo các chỉ dẫn điều chỉnh khuôn mặt nằm bên trong khung hình.</li>
                        <li>Khi xác thực thành công, màn hình xác thực sẽ tự động đóng và chuyển sang bước tiếp theo.</li>
                    </ul>
                </div>
                <div className="flex justify-center my-3 px-5">
                    <button className="btn w-full px-5 bg-yellow-400 border border-yellow-300 uppercase align-center font-semibold text-lg 
                    hover:bg-yellow-500 hover:border-yellow-300 hover:text-white"
                    onClick={onClick}>Bắt đầu</button>
                </div>
            </div>
        </>
    );
}