import { createContext, useState, useEffect } from "react";
import api from "../config/axios";

export const OrderContext = createContext();

export const defaultOrder = {
    customer: {
        id: undefined,
        fullName: "",
        mobile: "",
        email: "",
        identityCard: "",
        imageURL: "",
        authMethod: "Email"
    },
    receiver: {
        id: undefined,
        fullName: "",
        mobile: "",
        email: "",
        identityCard: "",
        imageURL: "",
        authMethod: "Email"
    },
    isDifferentPerson:false,
    locker: {
        id: undefined,
        no: undefined,
        sizeIndex: undefined,
        sizeLetter: undefined
    },
    order: {
        id: undefined,
        rentalTimeChoice: undefined,
        rentalTime: 0,
        maxRentalTime: 0,
        checkIn: null,
        checkOut: null,
        finalCheckOut: null,
        discountCodes: [],
        discountPrice: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
        priceListID: "",
        uuid:undefined
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

    async function createOrderCode() {
        const res = await api.get('api/generateOrderCode');
        const code = res?.data?.orderID;
        console.log(code);

        updateOrder("order", "id", code);
    }

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
        if (!order.order.id) {
            const orderCode = async () => { await createOrderCode(); }
            orderCode();
        }
        // console.log("OrderContext order changed:", order);
    }, [order]);

    useEffect(() => {
        if (order?.order.rentalTimeChoice === null || order?.locker.sizeLetter === null) return;
        const priceListID = createPriceListID(order.order.rentalTimeChoice, order.locker.sizeLetter);
        updateOrder("order", "priceListID", priceListID);
    }, [order.order.rentalTimeChoice, order.locker.sizeLetter]);

    function createPriceListID(rentalOpt = null, size = "") {

        if (rentalOpt === null || size === "") return;
        const rentalID = parseInt(rentalOpt) === 0 ? "PP4H" : "PBUS";
        const priceListID = `${rentalID}.${size}`;
        console.log("Price List ID: ", priceListID);

        return priceListID;
    }

    function resetOrder() {
        localStorage.removeItem("order");
        setOrder(defaultOrder);
    }

    function updateOrder(group, field, value) {
        setOrder(prev => ({
            ...prev,
            [group]: {
                ...prev[group],
                [field]: value
            }
        }));
    }


    return (
        <OrderContext.Provider value={{ order, setOrder, resetOrder, updateOrder }}>
            {children}
        </OrderContext.Provider>
    );

}