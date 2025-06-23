document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector('.banner-carousel');
    const items = document.querySelectorAll('.banner-item');
    const dots = document.querySelectorAll('.dot');
    const leftButton = document.querySelector('.arrow-btn.left');
    const rightButton = document.querySelector('.arrow-btn.right');

    let currentIndex = 0;
    let isTransitioning = false; 

    
    const updateCarousel = (instant = false) => {
        if (isTransitioning) return;
        isTransitioning = true;

        const offset = -currentIndex * 100;
        if (instant) {
            carousel.style.transition = "none"; 
        } else {
            carousel.style.transition = "transform 0.5s ease-in-out";
        }
        carousel.style.transform = `translateX(${offset}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        setTimeout(() => {
            isTransitioning = false;
        }, 500); 
    };

    
    carousel.addEventListener('transitionend', () => {
        isTransitioning = false;
    });

    
    leftButton.addEventListener('click', () => {
        if (isTransitioning) return;
        currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
        updateCarousel();
    });


    rightButton.addEventListener('click', () => {
        if (isTransitioning) return;
        currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex = index;
            updateCarousel();
        });
    });

    updateCarousel(true);
});
