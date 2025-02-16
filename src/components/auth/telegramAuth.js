import { useState, useEffect } from "react";

function useTelegramAuth() {
    const [authData, setAuthData] = useState(null);

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const data = window.Telegram.WebApp.initData;
            setAuthData(data);
        }
    }, []);

    return { authData };
}

export default useTelegramAuth;