export function useLocalStorage<T>(key: string, initialValue?: T) {
    const getItem = (): T | null => {
        const item = window.localStorage.getItem(key);

        if (item) {
            const payload = item.split(".")[1];

            try {
                return JSON.parse(atob(payload));
            } catch (error) {
                console.error("Error parsing payload:", error);
                return null;
            }
        } else {
            if (initialValue !== undefined) {
                window.localStorage.setItem(key, JSON.stringify(initialValue));
                return initialValue;
            } else {
                return null;
            }
        }
    };

    const setItem = (newValue: T) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
    };

    const removeItem = () => {
        window.localStorage.removeItem(key);
    };

    return { getItem, setItem, removeItem };
}
