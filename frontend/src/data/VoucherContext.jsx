import { createContext, useState, useEffect, useContext, useRef } from "react";
import { InitialDataContext } from "./InitialDataContext";
import { OrderContext } from "./OrderContext";

export const VoucherContext = createContext();
export function VoucherProvider({ children }) {
    const [voucherList, setVoucherList] = useState([]);
    const { vouchers, loading } = useContext(InitialDataContext);
    const {updateOrder}=useContext(OrderContext);
    const [discountPrice, setDiscountPrice] = useState(0);
    // const discountPrice=useRef(0);
   

    useEffect(() => {
        const total=voucherList.reduce(function(totalDiscount,item){
            return totalDiscount+getDiscountPrice(item);
        },0);
        console.log(voucherList);
        setDiscountPrice(total);
        updateOrder("order","discountPrice",total);
    }, [voucherList]);


    function resetVoucherList() {
        setVoucherList([]);
    }

    function addItem(code) {
        const finalCode = code.replace(/\s+/g, "").toUpperCase();

        if (!finalCode) return false;
        if (checkExistItem(finalCode)) {
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

    function getDiscountPrice(code){
         const finalCode = code.replace(/\s+/g, "").toUpperCase();
         if(!vouchers) return 0;
         const voucherItem=vouchers.find(function(item){
            return item.VOUCHER_ID===finalCode;
         });
         console.log("Voucher: ",voucherItem);
         return voucherItem?-voucherItem.DISCOUNT_VALUE:0;
    }

    function removeItem(code) {
        const newList = voucherList.filter(function (item) { return item !== code; });
        setVoucherList(newList);
    }

    return (
        <VoucherContext.Provider value={{ voucherList,discountPrice, resetVoucherList, addItem, checkExistItem, removeItem }}>
            {children}
        </VoucherContext.Provider>
    )
}