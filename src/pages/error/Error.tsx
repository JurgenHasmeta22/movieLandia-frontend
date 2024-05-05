import React from "react";
import { Footer } from "~/components/footer/Footer";
import { Header } from "~/components/header/Header";
import "~/pages/error/style.css";

export default function Error404(): React.JSX.Element {
    return (
            <div className="error-wrapper">
                <span>ERROR 404</span>
            </div>
    );
}
