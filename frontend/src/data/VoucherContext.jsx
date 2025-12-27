import { createContext, useState, useEffect, useContext, useRef } from "react";
import { InitialDataContext } from "./InitialDataContext";
import { OrderContext } from "./OrderContext";
import { useTranslation } from "react-i18next";
import api from "../config/axios";

export const VoucherContext = createContext();
export function VoucherProvider({ children }) {
    const { t, i18n } = useTranslation();
    const [voucherList, setVoucherList] = useState([]);
    const { vouchers, loading, setVouchers } = useContext(InitialDataContext);
    const { updateOrder } = useContext(OrderContext);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [errorVoucher, setErrorVoucher] = useState("");
    const [validLoading, setValidLoading] = useState(false);
    // const discountPrice=useRef(0);
    useEffect(() => { console.log(vouchers) }, [vouchers]);

    useEffect(() => {
        const total = voucherList.reduce(function (totalDiscount, item) {
            return totalDiscount + getDiscountPrice(item);
        }, 0);
        // console.log(voucherList);
        setDiscountPrice(total);
        updateOrder("order", "discountPrice", total);
    }, [voucherList]);


    function resetVoucherList() {
        setErrorVoucher("");
        setValidLoading(false);
        setVoucherList([]);
    }

    async function addItem(code) {
        const finalCode = code.replace(/\s+/g, "").toUpperCase();

        //-1: Mã code trùng lặp
        //-2: Ko tồn tại mã code
        //0: Mã hết hạn sử dụng
        //1: Áp mã thành công

        if (!finalCode) return false;
        if (checkExistItem(finalCode)) {
            setErrorVoucher(t("voucherError.0"));
            console.log(t("voucherError.0"));
            return false;
        }
        const result = await checkValidVoucher(finalCode);
        if (!result) {
            return false;
        }

        setVoucherList(prev => ([
            ...prev,
            finalCode
        ]));
        return true;
    }

    function checkExistItem(code) {
        return voucherList.includes(code);
    }

    async function checkValidVoucher(code) {
        setValidLoading(true);

        //Check mã Public
        let voucherInfo = vouchers.find(function (item) {
            return item.VOUCHER_ID === code;
        });
        console.log("Tra mã public: ", voucherInfo);

        if (voucherInfo == null) {
            //Check mã private
            console.log("Không tìm thấy public code: ", code);
            const res = await api.get("/api/getPrivateVoucher", { params: { code } });
            voucherInfo = res.data.result[0];
            console.log("Thông tin voucher sau truy vấn: ", voucherInfo);
            //Check mã có tồn tại ko
            if (!voucherInfo) {
                setErrorVoucher(t("voucherError.1"));
                console.log(t("voucherError.1"));
                setValidLoading(false);
                return false;
            }

        }
        setValidLoading(false);
        //Check mã đã được sử dụng chưa
        if (voucherInfo?.VALID_STATUS === 1) {
            setErrorVoucher(t("voucherError.2"));
            console.log(t("voucherError.2"));
            return false;
        }

        //Check mã đã hết hạn chưa
        if (checkExpiredEndOfDay(voucherInfo?.EXPIRED_DATE) === true) {
            setErrorVoucher(t("voucherError.3"));
            console.log(t("voucherError.3"));
            return false;
        }

        setErrorVoucher("");
        if (!vouchers.includes(voucherInfo))
            setVouchers(prev => ([...prev, voucherInfo]));
        return true;
    }

    function checkExpiredEndOfDay(expiredDate) {
        if (!expiredDate) return false;
        const expired = new Date(expiredDate);
        expired.setHours(23, 59, 59, 999);
        return Date.now() > expired.getTime();
    }

    function getDiscountPrice(code) {
        const finalCode = code.replace(/\s+/g, "").toUpperCase();
        if (!vouchers) return 0;
        const voucherItem = vouchers.find(function (item) {
            return item.VOUCHER_ID === finalCode;
        });
        return voucherItem ? -voucherItem.DISCOUNT_VALUE : 0;
    }

    function removeItem(code) {
        const newList = voucherList.filter(function (item) { return item !== code; });
        setVoucherList(newList);
    }

    return (
        <VoucherContext.Provider value={{ voucherList, discountPrice, resetVoucherList, addItem, checkExistItem, removeItem, errorVoucher, validLoading }}>
            {children}
        </VoucherContext.Provider>
    )
}