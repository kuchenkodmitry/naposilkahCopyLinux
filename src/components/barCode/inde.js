import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const BarcodeComponent = ({ value }) => {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, value, {
                format: "CODE128", // Формат штрих-кода <button class="citation-flag" data-index="2">
                width: 2,         // Ширина линий штрих-кода
                height: 50,       // Высота штрих-кода
                displayValue: true, // Показывать значение под штрих-кодом
                fontOptions: "",   // Настройки шрифта
                fontSize: 14,      // Размер шрифта
                textColor: "#000000", // Цвет текста
                background: "#ffffff" // Цвет фона
            });
        }
    }, [value]);

    return <svg ref={barcodeRef}></svg>;
};

export default BarcodeComponent;