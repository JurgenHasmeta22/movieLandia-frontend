import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHelmetProps {
    title: string;
    description: string;
    name: string;
    type: string;
    canonicalUrl?: string;
    noIndex?: boolean;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
    title,
    description,
    name,
    type,
    canonicalUrl,
    noIndex,
}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="https://example.com/og-image.jpg" />
            <meta property="og:url" content={canonicalUrl || window.location.href} />
            <meta name="twitter:creator" content={name} />
            <meta
                name="twitter:card"
                content={type === "article" ? "summary_large_image" : "summary"}
            />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            {noIndex && <meta name="robots" content="noindex" />}
        </Helmet>
    );
};

export default SEOHelmet;
