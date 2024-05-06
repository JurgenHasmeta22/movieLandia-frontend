import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue?: T) {
    const getItem = (): T | null => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return null;
        }
    };

    const setItem = (newValue: T) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch {}
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch {}
    };

    const value: any = getItem();

    return { value, setItem, removeItem };
}
