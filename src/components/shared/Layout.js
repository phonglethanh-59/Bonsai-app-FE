import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import throttle from 'lodash.throttle';
import Navbar from './Navbar';
import Footer from './Footer';
import FirstLoginModal from './FirstLoginModal';
import ShoppingCart from './ShoppingCart';

const Layout = () => {
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.padding = '8px 0';
                    navbar.style.boxShadow = '0 2px 15px rgba(139, 69, 19, 0.1)';
                } else {
                    navbar.style.padding = '12px 0';
                    navbar.style.boxShadow = '0 2px 10px rgba(139, 69, 19, 0.07)';
                }
            }
        };
        const throttledHandleScroll = throttle(handleScroll, 150);
        window.addEventListener('scroll', throttledHandleScroll);
        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, []);

    return (
        <>
            <Navbar />
            <ShoppingCart />
            <FirstLoginModal />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
