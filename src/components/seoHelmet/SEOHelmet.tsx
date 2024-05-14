import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHelmetProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    imageUrl?: string;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
    title,
    description,
    name,
    type,
    canonicalUrl,
    noIndex,
    imageUrl,
}) => {
    return (
        <Helmet>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={`${description}`} />}
            {type && <meta property="og:type" content={type} />}
            {title && <meta property="og:title" content={title} />}
            {description && <meta property="og:description" content={description} />}
            {imageUrl && <meta property="og:image" content={imageUrl} />}
            {canonicalUrl && (
                <meta property="og:url" content={canonicalUrl || window.location.href} />
            )}
            {name && <meta name="twitter:creator" content={name} />}
            {type && (
                <meta
                    name="twitter:card"
                    content={type === "article" ? "summary_large_image" : "summary"}
                />
            )}
            {title && <meta name="twitter:title" content={title} />}
            {description && <meta name="twitter:description" content={description} />}
            {imageUrl && <meta name="twitter:image" content={imageUrl} />}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            {noIndex && <meta name="robots" content="noindex" />}
        </Helmet>
    );
};

export default SEOHelmet;
