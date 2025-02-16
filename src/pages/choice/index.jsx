import React from 'react';
import styles from './style.module.css';
import boxberry from '../../assets/image/choice/boxberry.png'
import cdek from '../../assets/image/choice/cdek.png'
import { useNavigate } from 'react-router';


const Choice = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.choiceContainer}>
            <div onClick={() => { navigate('/boxberry') }} className={styles.button}>
                <img width={220} src={boxberry} alt="" />
            </div>
            <div onClick={() => { navigate('/cdek') }} className={styles.button}>
                <img width={110} src={cdek} alt="" />
            </div>
        </div>
    );
};

export default Choice;