import React from "react";
import "./style.css";

interface IButtonProps {
    className?: string;
    type?: "button" | "submit" | "reset" | undefined;
    id?: string;
    onClick?: (e: any) => void;
    children?: any;
}

export const Button = (props: IButtonProps): React.JSX.Element => {
    const { className, type, id, onClick, children } = props;

    return (
        <button type={type} className={className} onClick={onClick} id={id}>
            {children}
        </button>
    );
};
