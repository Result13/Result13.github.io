 document.addEventListener('DOMContentLoaded', function() {
            const swiper = new Swiper('.use__slider', {
                direction: 'horizontal',
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
               
                speed: 800,
            });
        });