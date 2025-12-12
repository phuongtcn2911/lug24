export default function CurrencyFormat(number)
{
    const currencyFormat=new Intl.NumberFormat("vi-VN",{
        style:"currency",
        currency:"VND",
        minimumFractionDigits:0,
        maximumFractionDigits:0
    });
    return currencyFormat.format(number);
}