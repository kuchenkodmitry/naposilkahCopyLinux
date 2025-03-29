// DeliveryTypeSwitcher.js
import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

const DeliveryTypeSwitcher = ({ onOptionChange }) => {
    const [selectedOption, setSelectedOption] = useState('0');

    useEffect(() => {
        // Вызываем колбэк с начальным значением при монтировании компонента
        if (onOptionChange) {
            onOptionChange(selectedOption);
        }
    }, [onOptionChange]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        // Вызываем переданную функцию-колбэк с новым значением
        if (onOptionChange) {
            onOptionChange(option);
        }
    };

    return (
        <div className={styles.container}>
            {/* <div className={styles.label}>Тип выдачи</div> */}
            <div className={styles.switchContainer}>
                <div
                    className={`${styles.switchButton} ${selectedOption === '0' ? styles.selected : styles.unselected}`}
                    onClick={() => handleOptionChange('0')}
                >
                    Без вскрытия
                </div>
                <div
                    className={`${styles.switchButton} ${selectedOption === '1' ? styles.selected : styles.unselected}`}
                    onClick={() => handleOptionChange('1')}
                >
                    Со вскрытием
                </div>
            </div>
        </div>
    );
};

export default DeliveryTypeSwitcher;