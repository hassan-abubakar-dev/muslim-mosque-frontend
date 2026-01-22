import { useState, useEffect } from 'react';

export default function Toast({ message = "Something went wrong check your internect connection", duration = 3000 }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!show) return null;

    return (
        <div className="fixed top-4 z-50 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in justify-self-center">
            {message}
        </div>
    );
}