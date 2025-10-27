export const BankAccount={
    bank:"TCB",
    account:"19025011864019",
    name:"TRAN C NHAT PHUONG",
}

export function makeQRCode(amount, info)
{
    console.log(amount);
    console.log("Message: "+info);
    let url=`https://img.vietqr.io/image/${BankAccount.bank}-${BankAccount.account}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}&accountName=${encodeURIComponent(BankAccount.name)}`;
    return url;
}

//  const [bank, setBank] = useState("TCB");
//     const [account, setAccount] = useState("19025011864019");
//     const [name, setName] = useState("TRAN C NHAT PHUONG");
//     const [amount, setAmount] = useState(order.account);
//     const [info, setInfo] = useState();
//     const [url, setURL] = useState("https://img.vietqr.io/image/");