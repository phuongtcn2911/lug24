import logo from '../assets/img/Logo.png'
import pic1 from '../assets/icon/Import.png'
import pic2 from '../assets/icon/Export.png'
import pic3 from '../assets/img/Weapon.png'
import pic4 from '../assets/img/Chemical.png'
import pic5 from '../assets/img/Magazine.png'
import pic6 from '../assets/img/Wildlife.png'
import flagVN from '../assets/icon/VIETNAM.png'
import flagEN from '../assets/icon/USA.png'
import folderGap from '../assets/icon/Folder Gap.svg'
import successPayment from '../assets/img/successPayment.png'
import failPayment from '../assets/img/failPayment.png'
import cancelPayment from '../assets/img/cancelPayment.png'
import pendingPayment from '../assets/img/pendingPayment.png'
import tapToPay from '../assets/img/TapToPay.png'
import otp from '../assets/img/OTP.jpg'
import openLocker from '../assets/img/OpenLocker.png'
import closeLocker from '../assets/img/CloseLocker.png'
import inputOrder from '../assets/img/InputOrderCode.png'
import dectectQR from '../assets/img/detect_QR.png'
import dayjs from 'dayjs'
import beepMP3 from '../assets/sound/Beep.mp3'


export const Logo = logo;
export const API_BASE=import.meta.env.VITE_API_URL;

export const Flags = {
    flagVN: flagVN,
    flagEN: flagEN
};

export const AnimatedButtons = [
    {
        imgLink: pic1,
        color: "has-background-danger"
    },
    {
        imgLink: pic2,
        color: "has-background-link"
    },
];

export const VideoURL = "https://www.youtube.com/embed/qtS5UdGcTS4";
export function getVideoID(vidURL) {
    let parts = String(vidURL).split("/");
    let length = parts.length;
    return parts[length - 1];
}

// export const RentalTimeMilestone = [6,12,24,48];
export const RuleImgs = [pic3, pic4, pic5, pic6];
export const Promotion = {
    rentalTime: 4,
    lockers: [
        {
            size: 'M',
            price: 20000
        },
        {
            size: 'L',
            price: 40000
        },
    ]
};
export const Lockers = [
    {
        size: 'M',
        price: 2500
    },
    {
        size: 'L',
        price: 5000
    }
];

export const TaxIndex = 0.1;

export const OrderStatus = [
    pendingPayment, 
    successPayment,
    failPayment,
    cancelPayment 
]

export const TapToPay=tapToPay;
export const OTP=otp;
export const folder_Gap=folderGap;
export const InputOrderCode=inputOrder;
export const LockerStatus=[openLocker,closeLocker];
export const Timer={
    sessionDur:900,
    transactDur:180,
    lockerStatusDur:10,
    ordStatusDur:5,
    checkAvlBoxPing:10,
    resendOTP:90,
    validOTPDur:180
}

export const WorkingTime={
    open:dayjs().hour(10).minute(0),
    closed:dayjs().hour(22).minute(0),
};

export const detect_QR=dectectQR;
export const beepSound=beepMP3;
