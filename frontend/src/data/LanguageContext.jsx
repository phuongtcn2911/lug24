import { createContext, useEffect, useState } from "react";
import { WorkingTime } from "../data/Data";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(checkStoredLanguage()); // 0 = VN, 1 = EN
    const [flag, setFlag] = useState("flagVN");

    function changeLanguage() {
        if (lang == 0) {
            setLang(1);
            setFlag("flagEN");
        }
        else {
            setLang(0);
            setFlag("flagVN");
        }
    }

    function checkStoredLanguage() {
        const storeLang = sessionStorage.getItem("language");
        if (storeLang) {
            return JSON.parse(storeLang);
        }
        else {
            return 0;
        }
    }

    function resetLanguage(){
        setLang(0);
        setFlag("flagVN");
        sessionStorage.removeItem("language");
    }


    useEffect(() => {
        sessionStorage.setItem("language", JSON.stringify(lang));
    }, [lang]);





    const Languages = [
        {
            greetings: "Lug24 kính chào quý khách",
            sendParcel: "Gửi kiện hàng",
            receiveParcel: "Lấy kiện hàng",
            dayName: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
            btnBack: "Quay lại",
            legendRenter: "Thông tin người thuê tủ",
            labelRenterName: "Họ và tên",
            labelRenterEmail: "Email",
            labelRenterPhone: "Số điện thoại",
            btnSignUpViaMobile: "Đăng ký bằng số điện thoại",
            btnSignUpViaEmail: "Đăng ký bằng email",
            legendLocker: "Thông tin ô tủ",
            labelChooseSize: "Chọn kích thước",
            labelRentalTime: "Chọn thời gian thuê",
            legendOrder: "Đơn hàng",
            labelLockerSize: "Kích thước tủ ",
            labelRentalTimeOrder: "Thời gian thuê",
            labelMaxRentalTimeOrder: "Lưu trữ tối đa trong",
            labelPromoCode: "Mã giảm giá",
            btnEnterPromoCode: "Nhập mã",
            labelSubTotal: "Tạm tính",
            labelDiscount: "Giảm giá",
            labelTax: "Thuế (nếu có)",
            labelTotal: "Tổng cộng",
            labelSessionDuration: "Giao dịch sẽ kết thúc trong",
            btnCheckout: "Thanh toán",
            alertEmpty: "Thông tin không được bỏ trống",
            alertEmailInvalid: "Email không đúng",
            alertPhoneInvalid: "Số điện thoại không đúng",
            alertPromoInvalid: "Mã không hợp lệ",
            alertRentalTime: [
                "Thời gian lấy hàng phải diễn ra sau thời gian gửi hàng",
                "Cơ sở ký gửi chỉ hoạt động trong khung giờ từ " + String(WorkingTime.open.hour()).padStart(2, '0') + ":" + String(WorkingTime.open.minute()).padStart(2, '0') +
                " đến " + String(WorkingTime.closed.hour()).padStart(2, '0') + ":" + String(WorkingTime.closed.minute()).padStart(2, '0') + ". Vui lòng chọn lại khung giờ lấy hàng."
            ],
            alertOutOfLocker: "Tất cả tủ ký gửi đều đã đầy. Vui lòng quay lại sau.",
            labConfirm: "Tôi chấp nhận các điều khoản dịch vụ",
            btnReservation: "Đặt tủ",
            houseRule: [
                {
                    title: "Quy định ký gửi hành lý",
                    subTitle: "Khi sử dụng dịch vụ ký gửi hành lý này (Lug24), người sử dụng dịch vụ đã đọc, hiểu, đồng ý và cam kết tuân thủ các điều khoản và điều kiện"
                },
                {
                    title: "Vũ khí, đạn dược, vật liệu nổ",
                    subTitle: "Súng, dao, bom, đạn, thuốc nổ, pháo nổ, pháo hoa, các loại pháo khác và các vật liệu liên quan."
                },
                {
                    title: "Hóa chất, chất thải nguy hại và ma túy, chất gây nghiện",
                    subTitle: "Hóa chất độc hại, chất thải công nghiệp, chất gây ô nhiễm môi trường. Tất cả các loại ma túy, tiền chất và chất kích thích bị cấm. Các loại hóa chất bị cấm sản xuất, kinh doanh hoặc nhập khẩu"
                },
                {
                    title: "Ấn phẩm đồi trụy, phản động, hàng hóa vi phạm quyền sở hữu trí tuệ",
                    subTitle: "Sách báo, phim ảnh có nội dung đồi trụy, phản động hoặc kích động bạo lực. Hàng giả, hàng nhái, vi phạm bản quyền."
                },
                {
                    title: "Động vật, thực vật hoang dã, di vật cổ, văn hóa phẩm",
                    subTitle: "Các loài động vật và thực vật quý hiếm, có nguy cơ tuyệt chủng. Cổ vật và tác phẩm văn hóa có giá trị lịch sử hoặc văn hóa."
                }
            ],
            sizeUnit: "Cỡ ",
            rentalTimeUnit: " giờ",
            rentalTimeChoices: ["Giá dùng thử: 4 giờ", "Chọn thời gian lấy hàng"],
            labelCheckInTime: "Thời gian gửi hàng",
            labelCheckOutTime: "Thời gian lấy hàng",
            msgConfirm: ["Bằng việc chọn", "\"Xác nhận\"", "quý khách đã đồng ý với ", "Điều khoản dịch vụ", "của Lug24. Bạn có thể nhận được thông báo qua Email/SMS."],
            btnConfirm: "Xác nhận",
            terms: {
                title: "Điều khoản sử dụng dịch vụ",
                contents: [
                    {
                        chapter: "Điều 1: Sử dụng dịch vụ",
                        content: ["Người sử dụng phải cung cấp thông tin cá nhân (email, số điện thoại hoặc chứng minh nhân dân) khi sử dụng dịch vụ.",
                            "Người sử dụng phải đăng ký và thanh toán đầy đủ tất cả phí dịch vụ, bao gồm phí quá hạn.",
                            "Thông tin, mã đăng ký và mã nhận hành lý do Lug24 cung cấp là bí mật và không được tiết lộ cho bên thứ ba.",
                            "Lug24 không chịu trách nhiệm về thiệt hại hoặc mất mát nếu người sử dụng đăng ký với thông tin giả, không chính xác hoặc không xác thực."]
                    },
                    {
                        chapter: "Điều 2: Thời gian ký gửi và phí dịch vụ",
                        content: ["Phí dịch vụ được tính theo giá niêm yết trên lug24.com.",
                            "Thời gian ký gửi và nhận hành lý khác nhau theo từng địa điểm; người sử dụng phải tìm hiểu và chọn đúng địa điểm, thời gian trước khi đăng ký.",
                            "Thời gian sử dụng dịch vụ được tính theo khối 6 giờ, 12 giờ và 24 giờ. Nếu sử dụng ít hơn một khối, vẫn phải trả phí đầy đủ của khối đó.",
                            "Thời gian quá hạn và phí: Sau khi hết thời gian ký gửi ban đầu, Lug24 cho phép 10 phút gia hạn. Sau thời gian này, phí quá hạn sẽ được tính theo lịch phí chuẩn 6 giờ, 12 giờ và 24 giờ. Để thanh toán phí quá hạn, người sử dụng chỉ cần nhập mã đăng ký ban đầu, thanh toán phí và nhận hành lý.",
                            "Sau 48 giờ kể từ khi kết thúc thời gian dịch vụ đăng ký ban đầu, nếu không nhận hành lý, người sử dụng sẽ mất quyền sở hữu và lug24 được phép xử lý mà không cần bồi thường."]
                    },
                    {
                        chapter: "Điều 3: Các loại hàng hoá không ký gửi tại Lug24",
                        content: ["Vì lý do an ninh, Lug24 không cho phép ký gửi các vật phẩm bị cấm theo luật như được liệt kê trong danh sách đính kèm (**), tiền mặt, đá quý, trang sức hoặc hàng hóa có giá trị cao. Lug24 không kiểm tra hành lý khi ký gửi và do đó được miễn trừ trách nhiệm pháp lý về các vật phẩm bị cấm hoặc đối tượng chứa trong hành lý. Ngoài ra, thức ăn, nước uống, trái cây, thực phẩm, sản hải, thức ăn chế biến sẵn đều không đóng gói chân không không chấp nhận tại khoang ký gửi. Bất kì việc ký gửi không đúng danh sách hàng hóa được chấp nhận tại Lug24 như đã công bố sẽ bị phạt lên đến 5 triệu đồng/lần ký gửi và chịu bồi thường các thiệt hại xảy ra nếu gây ảnh hưởng về mùi và thiệt hại vật chất đến không gian ký gửi các các khoang ký gửi khác."]
                    },
                    {
                        chapter: "Điều 4: Bồi thường thiệt hại",
                        content: ["Lug24 sẽ bồi thường tối đa 2 triệu đồng/vụ trong trường xảy các thiệt hại do cháy nổ và trộm cắp.",
                            "Lug24 sẽ KHÔNG bồi thường thiệt hại trong các trường hợp sau:",
                            ["Người sử dụng cung cấp thông tin giả, không chính xác hoặc không xác thực khi đăng ký.",
                                "Thiệt hại kỹ thuật hoặc trầy xước xảy ra trong quá trình sử dụng dịch vụ trước khi ký gửi hành lý.",
                                "Các hư hại hoặc trầy xước đã có trước khi ký gửi hành lý tại Lug24.",
                                "Hành động của người sử dụng hoặc thông đồng với người khác để trộm cắp hoặc phá hủy tài sản.",
                                "Sự kiện bất khả kháng như thiên tai (động đất, lũ lụt, bão), chiến tranh, phá hủy hoặc các điều kiện không lường trước khác không do Lug24 gây ra.",
                                "Biểu tình, bạo loạn, phá hủy.",
                                "Bức xạ hoặc rò rỉ hạt nhân.",
                                "Mất mát hoặc thiệt hại do người sử dụng quên, đặt nhầm hoặc không kiểm tra hành lý khi nhận từ hệ thống Lug24.",
                                "Hành vi gian lận cố ý của người sử dụng để đổi hành lý.",
                                "Lệnh của chính phủ hoặc cơ quan quản lý yêu cầu thu hồi hành lý."
                            ],
                            "Ngay sau khi hành lý bị mất hoặc thiệt hại, người sử dụng phải cung cấp bằng chứng hình ảnh và báo cáo cho Lug24 để kiểm tra theo quy định. Căn cứ theo kết quả của cơ quan điều tra, Lug24 sẽ tiến hành bồi thường theo đúng như nội dung của cam kết này."]
                    },
                    {
                        chapter: "** Danh sách hàng hoá cấm",
                        content: [
                            "Hàng hóa cấm xuất nhập khẩu:",
                            [
                                "Vũ khí, đạn dược, vật liệu nổ: Súng, dao, bom, đạn, thuốc nổ và các vật liệu liên quan.",
                                "Chất độc, chất thải nguy hại: Hóa chất độc hại, chất thải công nghiệp, chất gây ô nhiễm môi trường.",
                                "Ma tuý, chất gây nghiện: Tất cả các loại ma túy, tiền chất và chất kích thích bị cấm.",
                                "Ấn phẩm đồi trụy, phản động: Sách báo, phim ảnh có nội dung đồi trụy, phản động hoặc kích động bạo lực.",
                                "Động vật, thực vật hoang dã: Các loài động vật và thực vật quý hiếm, có nguy cơ tuyệt chủng.",
                                "Hàng hóa vi phạm quyền sở hữu trí tuệ: Hàng giả, hàng nhái, vi phạm bản quyền.",
                                "Hóa chất cấm: Các loại hóa chất bị cấm sản xuất, kinh doanh hoặc nhập khẩu.",
                                "Pháo: Pháo nổ, pháo hoa và các loại pháo khác.",
                                "Di vật cổ, văn hóa phẩm: Cổ vật và tác phẩm văn hóa có giá trị lịch sử hoặc văn hóa."
                            ],
                            "Hàng hóa cấm vận chuyển:",
                            [
                                "Chất lỏng dễ cháy: Xăng, dầu, rượu, keo, sơn, nước hoa, v.v.",
                                "Chất khí dễ cháy: Bình gas, bật lửa gas, v.v.",
                                "Chất độc và chất lây nhiễm: Thuốc trừ sâu, virus, vi khuẩn gây bệnh.",
                                "Chất ăn mòn: Axit, pin, ắc quy, v.v.",
                                "Vũ khí, đạn dược: (trừ trường hợp được phép)",
                                "Hàng hóa có từ trường mạnh: Một số loại nam châm, thiết bị điện tử.",
                                "Tiền và giấy tờ có giá trị: (trừ trường hợp được phép)"
                            ],
                            "Hàng hóa cấm kinh doanh:",
                            [
                                "Thuốc thú y, thuốc bảo vệ thực vật cấm hoặc chưa được phép sử dụng: Bao gồm thuốc thú y và thuốc bảo vệ thực vật bị cấm sử dụng tại Việt Nam.",
                                "Đồ chơi nguy hiểm, đồ chơi có hại: Bao gồm đồ chơi có thể gây hại cho trẻ em, ảnh hưởng sức khỏe, nhân cách hoặc gây rối loạn trật tự công cộng.",
                                "Thực phẩm chức năng, mỹ phẩm không rõ nguồn gốc, không đảm bảo chất lượng: Bao gồm thực phẩm chức năng và mỹ phẩm không rõ nguồn gốc, không đảm bảo chất lượng hoặc có thể gây hại cho sức khỏe.",
                                "Hàng hóa không rõ nguồn gốc, xuất xứ: Bao gồm hàng hóa không có hóa đơn, chứng từ chứng minh nguồn gốc hoặc có thể là hàng giả, hàng nhái, hàng lậu."
                            ]
                        ]
                    }
                ],
            },
            notes: {
                title: "Lưu ý",
                content: [
                    "Thời gian thuê được làm tròn gần nhất với các bội số: 6h, 12h, 24h và 48h. Trong trường hợp quý khách lựa chọn ký gửi vượt các mốc thời gian trên thì sẽ được tính ở mốc thời gian kế tiếp.",
                    "Thời gian kí gửi tối đa của quý khách là 48 giờ. Sau thời gian lấy hàng được niêm yết, quý khách có 15 phút quá hạn không tính phí. Sau thời gian này, phí quá hạn sẽ được áp dụng.",
                    "Lưu ý về thời gian hoạt động tại cơ sở ký gửi có thể ảnh hưởng đến việc lấy hàng của quý khách."
                ]
            },
            labelChangePaymentMethod: "Thay đổi phương thức thanh toán",
            paymentMethod: ["Thanh toán chạm", "Quét mã QR"],
            progressStatus: ["Thanh toán", "Nhập mã OTP", "Mở tủ", "Hoàn tất"],
            orderStatus: ["Chờ thanh toán", "Thanh toán thành công", "Thanh toán thất bại", "Đơn hàng đã bị hủy"],
            orderInfo: ["Mã đơn hàng", "Tổng đơn hàng", "Thời gian lấy hàng"],
            labelPaymentDirection: ["Đặt thẻ vào khu vực quét", "Quét QR để thanh toán"],
            defaultBankingMsg: "Lug24 - Thanh toán hóa đơn",
            labelEndTransaction: "Giao dịch sẽ kết thúc trong",
            labelMessage: "Nội dung",
            labelCancelTransaction: "Hủy giao dịch",
            labelCustomer: "Khách hàng",
            labelTransition: ["Ứng dụng sẽ tự động chuyển trang trong", "giây"],
            labelConfirmOTP: {
                title: "Xác nhận mã mở tủ",
                subtitle: "Nhập 6 số được gửi cho bạn thông qua email/số điện thoại mà bạn cung cấp",
                resend: "Gửi lại mã OTP",
                resendCountDown: "Gửi lại sau ",
                error: "Mã OTP không chính xác",
                success: "Mã OTP đã được gửi đi",
            },
            lockerStatus: [
                {
                    title: "Tủ # đang mở",
                    note: ["Vui lòng đặt kiện hàng vào khoang tủ, sau đó ấn mạnh để đóng tủ.", "Không rời khỏi tủ trong lúc quá trình đang được xử lý."],
                },
                {
                    title: "Tủ đã đóng",
                    note: ["Kiện hàng được gửi thành công.", "Biên nhận sẽ được gửi về email/số điện thoại mà bạn cung cấp."],
                }
            ],
            labelLockerID: "Mã tủ",
            labelUpdate: "Tính năng này đang được cập nhật ...",

        },
        {
            greetings: "Welcome to Lug24",
            sendParcel: "Drop off parcel",
            receiveParcel: "Pick up parcel",
            dayName: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            btnBack: "Back",
            legendRenter: "Locker renter information",
            labelRenterName: "Fullname",
            labelRenterEmail: "Email",
            labelRenterPhone: "Mobile",
            btnSignUpViaMobile: "Sign up with phone number",
            btnSignUpViaEmail: "Sign up with email",
            legendLocker: "Rental locker options",
            labelChooseSize: "Choose a rental size",
            labelRentalTime: "Choose a rental time",
            legendOrder: "Booking",
            labelLockerSize: "Locker's size ",

            labelRentalTimeOrder: "Rental time",
            labelMaxRentalTimeOrder: "Maximum storage time",
            labelPromoCode: "Promo code",
            btnEnterPromoCode: "Enter code",
            labelSubTotal: "Subtotal",
            labelDiscount: "Discount",
            labelTax: "Tax (if capable)",
            labelTotal: "Total",
            labelSessionDuration: "The session will end in",
            btnCheckout: "Checkout",
            alertEmpty: "This field is required",
            alertEmailInvalid: "Invalid email",
            alertPhoneInvalid: "Invalid phone number",
            alertPromoInvalid: "Invalid code",
            alertRentalTime: [
                "Pickup time must be after drop-off time!",
                "The storage facility operates only between "
                + String(WorkingTime.open.hour()).padStart(2, '0') + ":" + String(WorkingTime.open.minute()).padStart(2, '0') +
                " and " + String(WorkingTime.closed.hour()).padStart(2, '0') + ":" + String(WorkingTime.closed.minute()).padStart(2, '0') +
                ". Please select another pickup time.",
            ],
            alertOutOfLocker: "All storage lockers are full. Please come back later.",

            labConfirm: "I agree to the Terms and Conditions",
            houseRule: [
                {
                    title: "Checked luggage regulations",
                    subTitle: "Use of this baggage deposit service (Lug24) constitutes your agreement to the Terms and Conditions."
                },
                {
                    title: "Weapons, ammunition, explosives",
                    subTitle: "Gun, knife, bomb, bullet, grenade and relevant explosives. All types of fireworks are banned."
                },
                {
                    title: "Toxic substances, hazardous waste, Narcotics and Addictive Substances",
                    subTitle: "Toxic chemicals, industrial waste, environmental pollutants. All types of illegal drugs and their precursors are prohibited."
                },
                {
                    title: "Harmful, Obscene, and Reactionary Cultural Products, infringing goods",
                    subTitle: "Films, books, and other cultural items that are considered harmful, depraved, or politically reactionary, counterfeit, trademark-infringing, copyright infringing and patent infringing goods. Items of historical and cultural value."
                },
                {
                    title: "Endangered Wild Animals and Plants, Antiquities and Relics",
                    subTitle: "Threatened and protected species. Items of historical and cultural value."
                }
            ],
            sizeUnit: "Size ",
            rentalTimeUnit: "  hours",
            rentalTimeChoices: ["Trial Time: 4 hours", "Choose a pick-up time"],
            labelCheckInTime: "Check-in Time",
            labelCheckOutTime: "Check-out Time",
            btnReservation: "Book a locker",
            msgConfirm: ["By selecting", "\"Confirmation\"", " you agree to Lug24’s", "Terms of Service", ". You may also receive notifications via Email/SMS."],
            btnConfirm: "Confirmation",
            terms: {
                title: "User's Terms and Conditions",
                contents: [
                    {
                        chapter: "Article 1: User’s service commitment",
                        content: [
                            "The user of this service is required to provide personal contacts (email, phone number or personal identification where needed) for the locker service registration.",
                            "The user has to register to book a locker and is liable for paying all the locker rental fees, including the surcharged fee for late(s).",
                            "All registered contact information, codes provided by lug24 during the service is confidential to the user only and non-disclosed to any third party for any reason.",
                            "Lug24 will not be liable for loss or damage if any intentionally false, impersonation or misleading information provided by the user during the service."
                        ]
                    },
                    {
                        chapter: "Article 2: Storage time and service fee",
                        content: [
                            "The service fee is public at Price on www.lug24.com",
                            "The luggage check-in and check-out times might vary from one to another location; the user is expected to refer to our public info for each location to choose a proper locker location and timing before registration.",
                            "The standard storage fee is calculated on the basis of 6, 12, and 24 hours. If the storage is less than those fixed standard timings, the full fee will be applied accordingly.",
                            "Overtime storage and surcharge fee: When the registered storage time is up, the maximum allowed waiting time is 10 minutes for the luggage to be checked-out from the locker. Any extra time beyond will be applied as a surcharge fee calculated on the basis of 6, 12, 24 hours. For surcharge fee payment, the user just logs in with registered info and verification code, makes payment and checks the luggage out.",
                            "After 48 hours compared to the paid storage time, if the luggage is not checked out by the user, the user is deemed to have given permission for lug24 to dispose of the item and lug24 will not be liable for any compensation."]
                    },
                    {
                        chapter: "Article 3: Items and Good are not accepted at Lug24 locker",
                        content: ["For security reasons, all prohibited items, weapons, illegal things listed (**) in the user's terms are not accepted at any locker at lug24 Besides, cash and cash equivalents, valuable notes, stocks, securities, valuable things and items are not accepted for storage. As this is a self-service luggage locker, items are stored at a locker on the user's own Items will not undergo procedures by lug24 staff. Lug24 will be disclaimed for any illegal items stored at our locker due to the user's intention. Furthermore, food and beverage, fruits, non-vacuum packed food, seafood, and read-to-eat food are not welcomed. A fine of 5 million VND will be applied for any unaccepted item stored at the Lug24 locker per one time."]
                    },
                    {
                        chapter: "Article 4: Compensation",
                        content: ["Lug24 accepts a maximum liability of 2 million VND in the event of loss of the luggage due to an accident or caused by fire.",
                            "Lug24 will NOT liable for any compensation for either of circumstances as listed below:",
                            [
                                "False, misleading or impersonation information provided by the user when registration for a locker booking.",
                                "Existing damages, scratches, fractures, worn-out or those are caused by the user during the self-service check-in or check-out at Lug24 locker.",
                                "Damage or scratches that existed before storing luggage at Lug24.",
                                "The user's intentional act or in collaboration with another person or party for damage, destroying or theft.",
                                "Force majeure such as natural disasters (typhoons, flooding, earthquakes, and the likes), war, enemy aggression, rebellions, and other unexpected force majeure out of lug24 expectation.",
                                "Strikes, riots, public harassment.",
                                "Effects of nuclear splitting, mitigation or radiation.",
                                "Loss or damages caused by the user unintentionally leaving behind after check-in and check-out or leaving.",
                                "Wrongful act on purpose of the user to claim for the luggage loss and damage.",
                                "Confiscation or seizure by relevant authorities or by the government orders."
                            ],
                            "Lug24 will not take any responsibilities after the luggage is checked out from the locker by the user. In the event of loss and damage, the user is expected to immediately report to Lug24 with proven evidence and details. Based on the relevant authorities investigation, Lug24 will take liability for damage and loss covered by this agreement."]
                    },
                    {
                        chapter: "** List of Prohibited Goods",
                        content: [
                            "Prohibited goods for import-export",
                            [
                                "Weapons, ammunition, explosives: gun, knife, bomb, bullet, grenade and relevant explosives.",
                                "Toxic substances, hazardous waste: Toxic chemicals, industrial waste, environmental pollutants.",
                                "Narcotics and Addictive Substances: All types of illegal drugs and their precursors are prohibited.",
                                "Harmful, Obscene, and Reactionary Cultural Products: Films, books, and other cultural items that are considered harmful, depraved, or politically reactionary.",
                                "Endangered Wild Animals and Plants: threatened and protected species.",
                                "Infringing goods: counterfeit, trademark-infringing, copyright infringing and patent infringing goods",
                                "Prohibited chemicals: Types of chemicals prohibited from production, business or import.",
                                "Fireworks: All types of fireworks are banned.",
                                "Antiquities and Relics: Items of historical and cultural value."
                            ],
                            "Items prohibited for transportation:",
                            [
                                "Flammable liquids: Gasoline, oil, alcohol, glue, paint, perfume, etc.",
                                "Flammable gases: Gas cylinders, gas lighters, etc.",
                                "Toxic and infectious substances: Pesticides, viruses, disease-causing bacteria.",
                                "Corrosive substances: Acids, batteries, accumulators, etc.",
                                "Vũ khí, đạn dược: (except when permitted)",
                                "Goods with strong magnetic fields: Some types of magnets, electronic devices.",
                                "Money and valuable documents: (except when permitted)"
                            ],
                            "Prohibited goods:",
                            [
                                "Veterinary drugs and pesticides banned or not yet permitted for use: Including veterinary drugs and pesticides banned for use in Vietnam.",
                                "Dangerous, harmful toys: Including toys that can harm children, affect health, personality or disrupt public order.",
                                "Supplementary foods and cosmetics of unknown origin and poor quality: Including functional foods and cosmetics of unknown origin, not guaranteed quality or possibly harmful to health.",
                                "Goods of unknown origin: Including goods without invoices or documents proving origin or may be counterfeit, fake or smuggled goods."
                            ]
                        ]
                    }
                ]
            },
            notes: {
                title: "Note:",
                content: [
                    "Rental time is rounded up to the nearest multiple of 6h, 12h, 24h, or 48h. If you choose a deposit duration that exceeds these thresholds, it will be charged at the next applicable time block.",
                    "The maximum deposit time allowed is 48 hours. After the posted pickup time, you have a 15-minute grace period free of charge. Beyond this period, overtime fees will apply.",
                    "Please note that the operating hours of the baggage deposit facility may affect your ability to pick up your items."
                ]
            },
            paymentMethod: ["Tap to Pay", "QR Code Payment"],
            labelChangePaymentMethod: "Change another payment method",
            progressStatus: ["Payment", "Enter OTP", "Open locker", "Complete"],
            orderStatus: ["Pending Payment", "Payment Successful", "Payment Failed", "Order Cancelled"],
            orderInfo: ["Order ID", "Order Total", "Pickup Time"],
            labelPaymentDirection: ["Place your card on the reader", "Scan QR to pay"],
            defaultBankingMsg: "Lug24 - Payment for order",
            labelEndTransaction: "The transaction will expire in",
            labelMessage: "Message",
            labelCancelTransaction: "Cancel transaction",
            labelCustomer: "Customer's Name",
            labelTransition: ["The app will automatically redirect in", "seconds"],
            labelConfirmOTP: {
                title: "Confirm Locker Access Code",
                subtitle: "Enter the 6-digit code sent to your provided email or phone number",
                resend: "Resend OTP",
                error: "Invalid OTP",
                resendCountDown: "Resend in ",
                success: "OTP has been sent",
            },
            lockerStatus: [
                {
                    title: "Locker is open",
                    note: ["Please place your parcel into the locker compartment, then push firmly to close it.", "Do not leave the locker while the process is in progress."],
                },
                {
                    title: "Locker is closed",
                    note: ["Your parcel has been successfully stored.", "A receipt will be sent to the email or phone number you provided."]
                }
            ],
            labelLockerID: "Locker n.o",
            labelUpdate: "This function is under constructing ...",
        }
    ];

    return (
        <LanguageContext.Provider value={{ lang, setLang, flag, setFlag, Languages, changeLanguage,resetLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}