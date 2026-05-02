"use client";

import React from 'react'
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

const ConditionalFooter = () => {
    const pathname = usePathname();
    const hideFooter = pathname.startsWith('/blogs') || pathname.startsWith('/admin');

    return (
        <>
            {!hideFooter && <Footer />}
        </>
    );
};

export default ConditionalFooter;
