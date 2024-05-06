import { useState, useEffect } from "react";

export function useResizeWindow() {
    const [isPageShrunk, setIsPageShrunk] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsPageShrunk(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return isPageShrunk;
}
