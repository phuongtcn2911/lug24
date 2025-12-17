import { createContext, useState, useEffect } from "react";
import { Promotion } from '../data/Data';

export const OrderContext = createContext();

export const defaultOrder = {
    customer: {
        id: "",
        fullName: "",
        mobile: "",
        email: "",
        identityCard: "",
        imageURL: ""
    },
    receiver: {
        id: "",
        fullName: "",
        mobile: "",
        email: "",
        identityCard: "",
        imageURL: ""
    },
    locker: {
        id: undefined,
        sizeIndex: undefined,
        sizeLetter: ''
    },
    order: {
        id: undefined,
        subID: undefined,
        rentalTimeChoice:null,
        rentalTime: Promotion.rentalTime,
        maxRentalTime: Promotion.rentalTime,
        checkIn: null,
        checkOut: null,
        finalCheckOut: null,
        discountCode: "",
        discountPrice: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
        priceListID:""
    },
    transaction: {
        uuid: undefined,
        qrURL: undefined,
        checkoutURL: undefined,
        paymentMethod: undefined,
        description: ""
    }
}

export function OrderProvider({ children }) {
    const [order, setOrder] = useState(checkLocalStoreOrder);

    function checkLocalStoreOrder() {
        try {
            const localOrder = localStorage.getItem("order");
            if (localOrder) {
                return JSON.parse(localOrder);
            }
            return defaultOrder;
        }
        catch {
            return defaultOrder;
        }
    }

    useEffect(() => {
        localStorage.setItem("order", JSON.stringify(order));
        // console.log("OrderContext order changed:", order);
    }, [order]);


    function resetOrder() {
        localStorage.removeItem("order");
        setOrder(defaultOrder);
    }


    return (
        <OrderContext.Provider value={{ order, setOrder, resetOrder }}>
            {children}
        </OrderContext.Provider>
    );

}