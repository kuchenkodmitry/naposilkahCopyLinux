import React from 'react';
import styles from './style.module.css';
import { motion } from 'framer-motion'; // Импортируем motion из framer-motion
import iconBox from '../../assets/image/icons/box.png';
import iconHistory from '../../assets/image/icons/histoty.png';
import PaperIco from '../../assets/image/icons/pape1r.png';
import iconRules from '../../assets/image/icons/Rules.png';
import iconInfo from '../../assets/image/icons/info.png';
import iconQuestion from '../../assets/image/icons/Question.png';
import { useNavigate } from 'react-router';

const buttonVariants = {
    hidden: { opacity: 0, y: 50 }, // Начальное состояние: невидимый, смещенный вниз
    visible: { opacity: 1, y: 0 }, // Конечное состояние: видимый, на месте
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Задержка между анимациями дочерних элементов
        },
    },
};

const MainPage = () => {
    const navigate = useNavigate();

    const handleRedirectToBoxberry = () => {
        window.location.href = 'https://boxberry.ru/tracking-page';
    };

    return (
        <motion.div
            className={styles.mainContainer}
            variants={containerVariants} // Применяем варианты анимации к контейнеру
            initial="hidden"
            animate="visible"
        >
            {/* Кнопка 1 */}
            <motion.div
                className={styles.buttonPointer}
                onClick={() => navigate('/boxberry')}
                variants={buttonVariants} // Применяем варианты анимации к кнопке
                whileHover={{ scale: 1.05 }} // Анимация при наведении
                whileTap={{ scale: 0.95 }} // Анимация при клике
            >
                <img width={45} src={iconBox} alt="Отправить посылку" />
                <a>Отправить посылку</a>
            </motion.div>

            {/* Кнопка 2 */}
            <motion.div
                className={styles.button}
                onClick={() => navigate('/history')}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img width={45} src={iconHistory} alt="История отправлений" />
                <a>История отправлений</a>
            </motion.div>

            {/* Кнопка 3 */}
            <motion.div
                className={styles.button}
                onClick={() => navigate('/trackBoxberry')}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img width={35} src={PaperIco} alt="Отследить посылку" />
                <a>Отследить посылку</a>
            </motion.div>

            {/* Кнопка 4 */}
            <motion.div
                className={styles.button}
                onClick={() => navigate('/rules')}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img width={45} src={iconRules} alt="Правила отправки посылок" />
                <a style={{ fontSize: 16, fontWeight: 500 }}>Правила отправки посылок</a>
            </motion.div>

            {/* Кнопка 5 */}
            <motion.div
                className={styles.button}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    navigate('/about')
                }}
            >
                <img
                    style={{ padding: '0 10px' }}
                    width={25}
                    src={iconInfo}
                    alt="О проекте"
                />
                <a>О проекте</a>
            </motion.div>

            {/* Кнопка 6 */}
            <motion.div
                onClick={() => {
                    navigate("/faq")
                }}
                className={styles.button}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img width={45} src={iconQuestion} alt="Задать вопрос" />
                <a>Часто задаваемые вопросы</a>
            </motion.div>
        </motion.div>
    );
};

export default MainPage;