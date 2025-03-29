// CalculateCost.js
import React, { useRef, useState, useEffect } from 'react';
import Boxberry from '../../assets/image/choice/boxberryGray.png';
import Cdek from '../../assets/image/choice/cdekgray.png';
import { useLocation, useNavigate } from 'react-router';
import styles from './style.module.css';
import Cookies from 'js-cookie';
import Search from '../../search/index';
import DeliveryTypeSwitcher from '../../components/DeliveryTypeSwitcher';
import { calculateCost as calculateCostApi } from '../../api/api'; // Импортируем функцию из api.js
import DeliveryPack from '../../data/boxes.json'

const CalculateCost = () => {
    const location = useLocation();
    const searchRef1 = useRef(null);
    const searchRef2 = useRef(null);
    const weightInputRef = useRef(null);
    const priceInputRef = useRef(null);
    const [weight, setWeight] = useState('');
    const [declaredPrice, setDeclaredPrice] = useState('');
    const [error, setError] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isPriceTouched, setIsPriceTouched] = useState(false);
    const [isWeightTouched, setIsWeightTouched] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();
    const isBoxberry = location.pathname === '/boxberry';
    const sizes = isBoxberry ? DeliveryPack.boxberry : DeliveryPack.cdek;
    const [dimensions, setDimensions] = useState(sizes[0].value);
    const telegram_id = Cookies.get('telegram_id');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        console.log(`Выбранный вариант: ${option}`);
    };

    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
        };
        if (weightInputRef.current) {
            weightInputRef.current.addEventListener('wheel', handleWheel);
        }
        if (priceInputRef.current) {
            priceInputRef.current.addEventListener('wheel', handleWheel);
        }
        return () => {
            if (weightInputRef.current) {
                weightInputRef.current.removeEventListener('wheel', handleWheel);
            }
            if (priceInputRef.current) {
                priceInputRef.current.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const validateInputs = () => {
        const startAddress = searchRef1.current?.getValue() || '';
        const endAddress = searchRef2.current?.getValue() || '';
        if (startAddress && endAddress && startAddress === endAddress) {
            setError('Адрес отправления и получения не могут совпадать.');
            setIsButtonDisabled(true);
            return;
        }
        if (!startAddress || !endAddress) {
            setError('');
            setIsButtonDisabled(true);
            return;
        }
        if (isPriceTouched && Number(declaredPrice) < 1000) {
            setError('Цена посылки не может быть менее 1000 рублей.');
            setIsButtonDisabled(true);
            return;
        }
        if (isWeightTouched && Number(weight) < 500) {
            setError('Минимальный вес посылки 500 грамм.');
            setIsButtonDisabled(true);
            return;
        }
        setError('');
        setIsButtonDisabled(false);
    };

    useEffect(() => {
        validateInputs();
    }, [weight, declaredPrice, dimensions]);

    const handleWeightChange = (e) => {
        const value = e.target.value;
        setWeight(value === '' ? '' : Math.max(0, parseInt(value, 10) || 0));
        setIsWeightTouched(true);
    };

    const handleDeclaredPriceChange = (e) => {
        const value = e.target.value;
        setDeclaredPrice(value === '' ? '' : Math.max(0, parseInt(value, 10) || 0));
        setIsPriceTouched(true);
    };

    const handleAddressChange = (ref, value) => {
        ref.current.setValue(value);
        validateInputs();
    };

    const handleSubmit = async () => {
        const startAddress = searchRef1.current?.getValue() || '';
        const endAddress = searchRef2.current?.getValue() || '';
        if (!startAddress || !endAddress || !weight || !declaredPrice) {
            setError('Пожалуйста, заполните все поля.');
            setIsButtonDisabled(true);
            return;
        }
        validateInputs();
        if (isButtonDisabled) return;

        const requestData = {
            weight,
            dimensions,
            declared_price: declaredPrice,
            targetstart: startAddress,
            target: endAddress,
            issue: selectedOption
        };

        try {
            const token = Cookies.get('auth_token');
            if (!token) {
                throw new Error('Токен не найден');
            }

            // Вызываем функцию из api.js для отправки данных
            const data = await calculateCostApi(telegram_id, isBoxberry ? 'boxberry' : 'cdek', requestData, token);

            navigate('/orderinfo', { state: { orderData: data } });
        } catch (error) {
            console.error('Ошибка:', error);
            setError('Произошла ошибка при отправке данных. Попробуйте еще раз.');
            setIsButtonDisabled(true);
        }
    };

    return (
        <div className={styles.containerHeight}>
            <img className={styles.deliveryLogo} src={isBoxberry ? Boxberry : Cdek} alt="" />
            {/* <p>{testbox['boxberry']}</p> */}
            <h4 style={{ margin: 0, padding: 0 }}>Данные для отправки</h4>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formComtainer}>
                <div className={styles.inputContainer}>
                    <label>Адрес пункта отправления
                        {/* <span className={styles.star}>*</span> */}
                    </label>
                    <Search
                        ref={searchRef1}
                        onChange={(value) => handleAddressChange(searchRef1, value)}
                        onBlur={validateInputs}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label>Адрес пункта получения
                        {/* <span className={styles.star}>*</span> */}
                    </label>
                    <Search
                        ref={searchRef2}
                        onChange={(value) => handleAddressChange(searchRef2, value)}
                        onBlur={validateInputs}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label>Ценность посылки
                        {/* <span className={styles.star}>*</span> */}
                    </label>
                    <input
                        ref={priceInputRef} // Присваиваем реф
                        className={styles.noSpinInput}
                        type="number"
                        value={declaredPrice}
                        onChange={handleDeclaredPriceChange}
                        onFocus={() => setIsPriceTouched(true)}
                    />
                    <p style={{ margin: 0, padding: 0, fontSize: '12px', color: 'gray' }}>Ценность посылки указывается в рублях</p>
                </div>
                <div className={styles.inputContainer}>
                    <label>Вес посылки
                        {/* <span className={styles.star}>*</span> */}
                    </label>
                    <input
                        ref={weightInputRef} // Присваиваем реф
                        className={styles.noSpinInput}
                        type="number"
                        value={weight}
                        onChange={handleWeightChange}
                        onFocus={() => setIsWeightTouched(true)}
                    />
                    <p style={{ margin: 0, padding: 0, fontSize: '12px', color: 'gray' }}>Вес посылки должен быть указан в граммах</p>
                </div>
                <div className={styles.inputContainer}>
                    <label>Тип выдачи</label>
                    <DeliveryTypeSwitcher onOptionChange={handleOptionChange} />
                </div>
                <div className={styles.inputContainer}>
                    <label>Размер посылки
                        {/* <span className={styles.star}>*</span> */}
                    </label>
                    <select
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                    >
                        {sizes.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* <div className={styles.chekContact}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: "#34466d", padding: 0, margin: 0 }}>
                    Для отправки оптовых заказов вы можете заключить с нами{" "}
                    <a href='/'>договор по ссылке</a>
                </label>
            </div> */}
            <br />
            <button className={styles.button} onClick={handleSubmit} disabled={isButtonDisabled}>
                Продолжить
            </button>
        </div>
    );
};

export default CalculateCost;