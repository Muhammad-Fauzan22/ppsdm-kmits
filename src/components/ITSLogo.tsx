"use client";

import Image from "next/image";

interface ITSLogoProps {
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

import { useState } from "react";

export default function ITSLogo({
    width = 120,
    height = 40,
    className = "",
    priority = false
}: ITSLogoProps) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <svg
                width={width}
                height={height}
                viewBox="0 0 24 24"
                className={`text-primary ${className}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="currentColor"
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
            </svg>
        );
    }

    return (
        <Image
            src="/logo-m-its.png"
            alt="Institut Teknologi Sepuluh Nopember - Logo Resmi"
            width={width}
            height={height}
            className={`object-contain ${className}`}
            priority={priority}
            sizes="(max-width: 768px) 20px, 120px"
            onError={() => setError(true)}
        />
    );
}
