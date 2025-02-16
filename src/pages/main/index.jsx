import React from 'react';
import styles from './style.module.css';
import iconBox from '../../assets/image/icons/box.png'
import iconHistory from '../../assets/image/icons/histoty.png'
import iconContract from '../../assets/image/icons/Contract.png'
import iconRules from '../../assets/image/icons/Rules.png'
import iconInfo from '../../assets/image/icons/info.png'
import iconQuestion from '../../assets/image/icons/Question.png'
import { useNavigate } from 'react-router';


const MainPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <div onClick={() => {
                navigate('/choice')
            }} className={styles.buttonPointer} >
                <img width={45} src={iconBox} />
                <a>Отправить посылку</a>
            </div>
            <div className={styles.button}>
                <img width={45} src={iconHistory} />
                <a>История отправлений</a>
            </div>
            <div className={styles.button}>
                <img width={35} src={iconContract} />
                <a>Заключить договор</a>
            </div>
            <div className={styles.button}>
                <img width={45} src={iconRules} />
                <a>Правила отправки посылок</a>
            </div>
            <div className={styles.button}>
                <img style={{ padding: '0 10px' }} width={25} src={iconInfo} />
                <a>О компании</a>
            </div>
            <div className={styles.button}>
                <img width={45} src={iconQuestion} />
                <a>Задать вопрос</a>
            </div>
        </>
    );
};

export default MainPage;