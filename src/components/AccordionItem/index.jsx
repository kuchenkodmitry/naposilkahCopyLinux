// AccordionItem.js
import React, { useState } from 'react';
import styles from './style.module.css';


const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.accordionItem}>
            <div className={`${styles.accordionHeader} ${isOpen ? styles.open : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
            </div>
            <div className={`${styles.accordionContent} ${isOpen ? styles.open : ''}`}>
                <p>{answer}</p>
            </div>
        </div>
    );
};

export default AccordionItem;