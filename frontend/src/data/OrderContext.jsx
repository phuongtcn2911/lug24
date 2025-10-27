import { createContext, useState, useEffect } from "react";
import{Promotion} from '../data/Data';

export const OrderContext = createContext();
export const defaultOrder = {
    orderID:undefined,
    lockerID:undefined,
    fullName: "",
    mobile: "",
    email: "",
    sizeIndex: undefined,
    rentalTime: Promotion.rentalTime,
    maxRentalTime:Promotion.rentalTime,
    discountCode: "",
    subTotal: 0,
    discount: 0,
    total: 0,
    tax: 0,
    checkIn:null,
    checkOut:null,
    paymentMethod:undefined
};

export function OrderProvider({ children }) {
    const [order, setOrder] = useState(defaultOrder);
    useEffect(() => {
        console.log("OrderProvider mounted");
    }, []);

    useEffect(() => {
        console.log("OrderContext order changed:", order);
    }, [order]);

    function resetOrder(){
        setOrder({...defaultOrder});
    }


    return (
        <OrderContext.Provider value={{ order, setOrder,resetOrder }}>
            {children}
        </OrderContext.Provider>
    );

}