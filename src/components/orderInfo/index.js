// OrderForm.js
import React, { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './OrderForm.module.css'; // Импортируем стили
import { useLocation } from 'react-router';
import Cookies from 'js-cookie';
import Boxberry from '../../assets/image/choice/boxberryGray.png';
import Cdek from '../../assets/image/choice/cdekgray.png';
import { submitOrderData as submitOrderDataApi } from '../../api/api'; // Импортируем функцию из api.js

const OrderForm = () => {
    const location = useLocation();
    const orderData = location.state?.orderData?.redirect_url || '';
    const [formData, setFormData] = useState({
        senderName: '',
        senderPhone: '',
        senderEmail: '',
        receiverName: '',
        receiverPhone: '',
        receiverEmail: '',
        agreed: false,
    });
    const [errors, setErrors] = useState({
        senderPhone: '',
        receiverPhone: '',
        senderEmail: '',
        receiverEmail: '',
        emailMatch: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [preliminaryPrice, setPreliminaryPrice] = useState(null);

    useEffect(() => {
        if (orderData) {
            const urlParams = new URLSearchParams(new URL(orderData).search);
            const price = urlParams.get('price');
            if (price) {
                setPreliminaryPrice(price);
            }
        }
    }, [orderData]);

    const validateEmails = (senderEmail, receiverEmail) => {
        if (senderEmail && receiverEmail && senderEmail === receiverEmail) {
            setErrors((prev) => ({
                ...prev,
                emailMatch: 'Email отправителя и получателя не могут совпадать',
            }));
        } else {
            setErrors((prev) => ({ ...prev, emailMatch: '' }));
        }
    };

    const validateEmail = (email, fieldName) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors((prev) => ({
            ...prev,
            [fieldName]: emailRegex.test(email) ? '' : 'Некорректный email',
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let updatedValue = type === 'checkbox' ? checked : value;
        if (name.includes('Phone')) {
            updatedValue = value.replace(/\D/g, '');
            if (updatedValue.startsWith('7') && updatedValue.length > 1) {
                updatedValue = updatedValue.slice(1);
            }
        }
        setFormData((prevState) => {
            const updatedState = { ...prevState, [name]: updatedValue };
            if (name === 'senderEmail' || name === 'receiverEmail') {
                validateEmail(updatedValue, name);
                validateEmails(updatedState.senderEmail, updatedState.receiverEmail);
            }
            return updatedState;
        });
    };

    const isFormValid = () => {
        return (
            formData.senderName &&
            formData.senderPhone &&
            formData.senderEmail &&
            formData.receiverName &&
            formData.receiverPhone &&
            formData.receiverEmail &&
            formData.agreed &&
            !Object.values(errors).some((error) => error)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (!isFormValid()) {
            alert('Исправьте ошибки перед отправкой!');
            return;
        }

        const requestData = {
            sender_full_name: formData.senderName,
            sender_phone: formData.senderPhone,
            sender_email: formData.senderEmail,
            recipient_full_name: formData.receiverName,
            recipient_phone: formData.receiverPhone,
            recipient_email: formData.receiverEmail,
        };

        try {
            const token = Cookies.get('auth_token');
            if (!token) {
                throw new Error('Токен не найден');
            }

            // Вызываем функцию из api.js для отправки данных заказа
            const data = await submitOrderDataApi(orderData, requestData, token);

            window.location.replace(data.redirect_url);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div className={styles.containerHeight}>
            {/* Отображение логотипа */}
            {orderData.includes('boxberry') && (
                <img src={Boxberry} alt="Boxberry" className={styles.deliveryLogo} />
            )}
            {orderData.includes('cdek') && (
                <img src={Cdek} alt="CDEK" className={styles.deliveryLogo} />
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Предварительная стоимость */}
                {preliminaryPrice !== null && (
                    <div className={styles.preliminaryPrice}>
                        <p className={styles.price}>Стоимость отправки заказа:</p>
                        <p style={{ color: 'orange', fontSize: "24px" }} className={styles.price}>
                            {preliminaryPrice} <span style={{ color: '#34466d', fontWeight: 700, fontSize: '24px' }}>₽</span>
                        </p>
                    </div>
                )}
                {/* Данные отправителя */}
                <div className={styles.sectionTitle}>Данные отправителя</div>
                <div className={styles.inputGroup}>
                    <label className={styles.labelStl}>Ф.И.О. отправителя</label>
                    <input
                        type="text"
                        name="senderName"
                        placeholder="Введите имя..."
                        value={formData.senderName}
                        onChange={handleChange}
                        required
                    />
                    {isSubmitted && !formData.senderName && (
                        <span className={styles.error}>Это поле обязательно для заполнения</span>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.labelStl}>Телефон отправителя</label>
                    <IMaskInput
                        mask="+{7} (000) 000-00-00"
                        value={formData.senderPhone}
                        onAccept={(value) => handleChange({ target: { name: 'senderPhone', value } })}
                        placeholder="+7 (___) ___-__-__"
                        required
                    />
                    {errors.senderPhone && <span className={styles.error}>{errors.senderPhone}</span>}
                    {isSubmitted && !formData.senderPhone && (
                        <span className={styles.error}>Это поле обязательно для заполнения</span>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.labelStl}>Email отправителя</label>
                    <input
                        placeholder="Введите @EMAIL..."
                        type="email"
                        name="senderEmail"
                        value={formData.senderEmail}
                        onChange={handleChange}
                        required
                    />
                    {errors.senderEmail && <span className={styles.error}>{errors.senderEmail}</span>}
                    {isSubmitted && !formData.senderEmail && (
                        <span className={styles.error}>Это поле обязательно для заполнения</span>
                    )}
                </div>
                {/* Данные получателя */}
                <div className={styles.sectionTitle}>Данные получателя</div>
                <div className={styles.inputGroup}>
                    <label className={styles.labelStl}>Ф.И.О. получателя</label>
                    <input
                        type="text"
                        name="receiverName"
                        placeholder="Введите имя..."
                        value={formData.receiverName}
                        onChange={handleChange}
                        required
                    />
                    {isSubmitted && !formData.receiverName && (
                        <span className={styles.error}>Это поле обязательно для заполнения</span>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.labelStl}>Телефон получателя</label>
                    <IMaskInput
                        mask="+{7} (000) 000-00-00"
                        value={formData.receiverPhone}
                        onAccept={(value) => handleChange({ target: { name: 'receiverPhone', value } })}
                        placeholder="+7 (___) ___-__-__"
                        required
                    />
                    {errors.receiverPhone && <span className={styles.error}>{errors.receiverPhone}</span>}
                    {isSubmitted && !formData.receiverPhone && (
                        <span className={styles.error}>Это поле обязательно для заполнения</span>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.labelStl}>Email получателя</label>
                    <input
                        placeholder="Введите @EMAIL..."
                        type="email"
                        name="receiverEmail"
                        value={formData.receiverEmail}
                        onChange={handleChange}
                        required
                    />
                    {errors.receiverEmail && <span className={styles.error}>{errors.receiverEmail}</span>}
                    {isSubmitted && !formData.receiverEmail && (
                        <span className={styles.error}>Это поле обязательно для заполнения</span>
                    )}
                </div>
                {/* Проверка совпадения email */}
                {errors.emailMatch && <span className={styles.errorEmail}>{errors.emailMatch}</span>}
                {/* Согласие с правилами */}
                <div className={styles.agreement}>
                    <label className={styles.checkboxText}>
                        <input
                            type="checkbox"
                            name="agreed"
                            checked={formData.agreed}
                            onChange={handleChange}
                        />
                        <p>Я прочитал(а) и согласен с правилами отправки посылок</p>
                    </label>
                    {isSubmitted && !formData.agreed && (
                        <span className={styles.error}>Необходимо согласиться с правилами</span>
                    )}
                </div>
                {/* Кнопка отправки */}
                <button type="submit" className={styles.submitButton}>
                    Продолжить
                </button>
            </form>
        </div>
    );
};

export default OrderForm;