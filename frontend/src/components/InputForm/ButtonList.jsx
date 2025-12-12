
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ButtonList({ arrayList, topic, group, changeButton, savedSelectedIndex, amountList }) {

    const [activeIndex, setActiveIndex] = useState(savedSelectedIndex);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (amountList.length === 0) return;

        // Tìm lựa chọn khả dụng đầu tiên (>0)
        const firstAvailable = amountList.findIndex(a => a > 0);

        // Nếu không có lựa chọn khả dụng thì thôi
        if (firstAvailable === -1) return;

        // Nếu chưa chọn gì, hoặc lựa chọn hiện tại đã hết hàng → chuyển sang lựa chọn khả dụng
        if (activeIndex == null || amountList[activeIndex] === 0) {
            setActiveIndex(firstAvailable);

            // Nếu có callback ngoài thì gọi luôn
            if (changeButton) {
                changeButton({ group, index: firstAvailable });
            }
        }
    }, [amountList]);



    function onClick(e, index) {
        e.preventDefault();
        setActiveIndex(index);
        // console.log("Group name: " + group + ". Index: " + savedSelectedIndex);

        if (changeButton != undefined) {
            changeButton({ group, index });
        }
    }


    return (
        <div className="field">
            <label className="label">{topic}</label>
            <div className="field is-grouped is-grouped-multiline mb-0">
                {

                    arrayList.map(function (label, index) {
                        let currentIndex;
                        if (activeIndex !== null && activeIndex !== undefined) {
                            currentIndex = activeIndex;
                        } else {
                            currentIndex = savedSelectedIndex;
                        }

                        const isActive = currentIndex === index && amountList[index] > 0;

                        return (
                            <p key={index} className="control badge-container">
                                <button
                                    className={`button ${isActive ? "is-warning is-selected" : ""}`}
                                    onClick={(e) => onClick(e, index)}
                                    disabled={amountList[index] === 0}>
                                    {`${t("sizeUnit")} ${label.size}`}
                                </button>
                                <span className="badge">{amountList[index]}</span>
                            </p>
                        );
                    })
                }
            </div>
            {savedSelectedIndex === undefined && (
                <p className="help is-danger">
                    {t("alertOutOfLocker")}
                </p>
            )
            }
        </div>
    );
}
