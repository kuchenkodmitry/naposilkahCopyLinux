import React, { useRef, useState } from 'react';
import Boxberry from '../../assets/image/choice/boxberryGray.png';
import Cdek from '../../assets/image/choice/cdekgray.png';
import { useLocation, useNavigate } from 'react-router';
import styles from './style.module.css';
import Search from '../../search/index';

const CalculateCost = () => {
    const location = useLocation();
    const searchRef1 = useRef(null);
    const searchRef2 = useRef(null);
    const [weight, setWeight] = useState('');
    const [dimensions, setDimensions] = useState('30x21');
    const [declaredPrice, setDeclaredPrice] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log('====================================');
        console.log({
            weight,
            dimensions,
            declared_price: declaredPrice,
            targetstart: searchRef1.current.getValue(),
            target: searchRef2.current.getValue()
        });
        console.log('====================================');
        const requestData = {
            weight,
            dimensions,
            declared_price: declaredPrice,
            targetstart: searchRef1.current?.getValue() || '',
            target: searchRef2.current?.getValue() || ''
        };

        try {
            const response = await fetch('https://naposilkah.ru/api/calculate-cost/1935152782/boxberry/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token d677468fbdc4820c3e4d5c12c0b586e534d22844'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }

            const data = await response.json();
            console.log('Ответ от сервера:', data);
            navigate('/orderinfo', { state: { orderData: data } });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div className={styles.containerHeight}>
            {location.pathname === '/boxberry' ? <img className={styles.deliveryLogo} src={Boxberry} alt="" /> : <img className={styles.deliveryLogo} src={Cdek} alt="" />}
            <div className={styles.container}>
                <h3>Данные для отправки</h3>
                <div className={styles.inputContainer}>
                    <label>Адрес пункта отправления</label>
                    <Search ref={searchRef1} />
                </div>
                <div className={styles.inputContainer}>
                    <label>Адрес пункта получения</label>
                    <Search ref={searchRef2} />
                </div>
                <div className={styles.inputContainer}>
                    <label>Ценность посылки</label>
                    <input type="number" value={declaredPrice} onChange={(e) => setDeclaredPrice(e.target.value)} />
                </div>
                <div className={styles.inputContainer}>
                    <label>Вес посылки </label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        style={{ fontSize: '12px', color: 'gray' }}
                    />
                    <p style={{ fontSize: '12px', color: 'gray' }}>Вес посылки не должен превышать 15 кг и должен быть указан в граммах</p>
                </div>
                <div className={styles.inputContainer}>
                    <label>Размер посылки</label>
                    <select value={dimensions} onChange={(e) => setDimensions(e.target.value)}>
                        <option value="30x21">Конверт 30x21 см</option>
                        <option value="15x15x10">Короб XS 15x15x10 см</option>
                        <option value="20x20x14">Короб S 20x20x14 см</option>
                        <option value="20x35x14">Короб M 20x35x14 см</option>
                        <option value="30x25x35">Короб L 30x25x35 см</option>
                        <option value="40x50x30">Короб XL 40x50x30 см</option>
                        <option value="80x20x15">Короб TL 80x20x15 см</option>
                        <option value="24x24">Пакет с клапаном XS 24x24 см</option>
                        <option value="24x32">Пакет с клапаном S 24x32 см</option>
                        <option value="30x40">Пакет с клапаном M 30x40 см</option>
                        <option value="39x51">Пакет с клапаном L 39x51 см</option>
                        <option value="60x75">Пакет с клапаном XL 60x75 см</option>
                    </select>
                </div>
                <input type="checkbox" />
                <label>Для отправки оптовых заказов вы можете заключить с нами договор по ссылке</label>
                <br />
                <button className={styles.button} onClick={handleSubmit}>Продолжить</button>
            </div>
        </div>
    );
};

export default CalculateCost;
