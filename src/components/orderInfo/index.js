import React, { useState } from 'react';
import styles from './OrderForm.module.css';
import { useLocation } from 'react-router';

const OrderForm = () => {
    const location = useLocation();
    const orderData = location.state.orderData.redirect_url
    const [formData, setFormData] = useState({
        senderName: '',
        senderPhone: '',
        senderEmail: '',
        receiverName: '',
        receiverPhone: '',
        receiverEmail: '',
        agreed: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.agreed) {
            alert('Вы должны согласиться с правилами!');
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
            console.log(requestData);
            const response = await fetch(orderData, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token d677468fbdc4820c3e4d5c12c0b586e534d22844'
                },
                body: JSON.stringify(requestData)
            });

            // if (!response.ok) {

            //     throw new Error('Ошибка при отправке данных');
            // }

            const data = await response.json();
            console.log('Ответ от сервера:', data);
            const redirect = window.location.href = data.redirect_url;
            redirect()
        } catch (error) {
            console.error('Ошибка:', error);
            // alert('Ошибка при отправке заказа');
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <h3>Данные отправителя</h3>
                <input type="text" name="senderName" placeholder="ФИО" value={formData.senderName} onChange={handleChange} required />
                <input type="tel" name="senderPhone" placeholder="Телефон" value={formData.senderPhone} onChange={handleChange} required />
                <input type="email" name="senderEmail" placeholder="Email" value={formData.senderEmail} onChange={handleChange} required />

                <h3>Данные получателя</h3>
                <input type="text" name="receiverName" placeholder="ФИО" value={formData.receiverName} onChange={handleChange} required />
                <input type="tel" name="receiverPhone" placeholder="Телефон" value={formData.receiverPhone} onChange={handleChange} required />
                <input type="email" name="receiverEmail" placeholder="Email" value={formData.receiverEmail} onChange={handleChange} required />

                <label>
                    <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} />
                    Я прочитал(а) и согласен с правилами отправки посылок
                </label>

                <button type="button" onClick={handleSubmit}>Продолжить</button>
            </form>
        </div>
    );
};

export default OrderForm;
