import { useEffect, useRef } from 'react';

const useScrollAnimation = (options = { threshold: 0.1, triggerOnce: true }) => {
    const elementRef = useRef(null);

    useEffect(() => {
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        if (options.triggerOnce) {
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold: options.threshold }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            // Thêm class ban đầu để animation có thể hoạt động
            currentElement.classList.add('scroll-animate');
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options]);

    return elementRef;
};

export default useScrollAnimation;