export const BankAccount={
    bank:"BIDV",
    account:"1470765104",
    name:"TRAN CONG NHAT PHUONG",
}

export function makeQRCode(amount, info)
{
    console.log(amount);
    console.log("Message: "+info);
    // let url=`https://img.vietqr.io/image/${BankAccount.bank}-${BankAccount.account}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}&accountName=${encodeURIComponent(BankAccount.name)}`;
    let url=`https://qr.sepay.vn/img?acc=${BankAccount.account}&bank=${BankAccount.bank}&amount=${amount}&des=${encodeURIComponent(info)}`
    return url;
}

//  const [bank, setBank] = useState("TCB");
//     const [account, setAccount] = useState("19025011864019");
//     const [name, setName] = useState("TRAN C NHAT PHUONG");
//     const [amount, setAmount] = useState(order.account);
//     const [info, setInfo] = useState();
//     const [url, setURL] = useState("https://img.vietqr.io/image/");