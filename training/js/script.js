document.addEventListener('DOMContentLoaded', () => {
    // Находим все кастомные селекты на странице
    const allSelects = document.querySelectorAll('.form__select');

    allSelects.forEach(selectWrapper => {
        const selectedText = selectWrapper.querySelector('.selected-text');
        const nativeSelect = selectWrapper.querySelector('select');
        const options = selectWrapper.querySelectorAll('.option');

        // 1. Открытие/закрытие конкретного селекта
        selectWrapper.addEventListener('click', (e) => {
            // Если кликнули по опции — ничего не делаем здесь (обработает другой слушатель)
            if (e.target.closest('.option')) return;

            // Закрываем другие открытые селекты перед открытием текущего (опционально)
            allSelects.forEach(otherSelect => {
                if (otherSelect !== selectWrapper) {
                    otherSelect.classList.remove('active');
                }
            });

            selectWrapper.classList.toggle('active');
        });

        // 2. Выбор опции внутри конкретного селекта
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;

                // Обновляем текст и значение
                if (selectedText) selectedText.textContent = text;
                if (nativeSelect) nativeSelect.value = value;

                // Подсветка активной опции
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                // Закрываем текущий список
                selectWrapper.classList.remove('active');

                // Генерируем событие 'change' на нативном селекте (полезно для других скриптов)
                nativeSelect.dispatchEvent(new Event('change'));
            });
        });
    });

    // 3. Закрытие при клике в любое другое место экрана
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.form__select')) {
            allSelects.forEach(select => select.classList.remove('active'));
        }
    });






    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.modal__close');
    const promoBtns = document.querySelectorAll('.open');

    function openModal() {
        modal.classList.add('active');
    }
    function closeModal() {
        modal.classList.remove('active');
    }
    promoBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });



});
document.addEventListener('DOMContentLoaded', () => {

    const elementsToAnimate = [
        '.promo__logo',
        '.promo__time',
        '.promo__title',
        '.promo__desc',
        '.promo__features__item', 
        '.promo__btn',
        '.promo__img_big',
        '.promo__img_small',
        '.location__desc',
        '.title',
        '.location__item',
        '.location__text',
        '.about__desc',
        '.about__iframe',
        '.about__video__desc',
        '.about__system',
        '.about__system__item',
        '.about__steps__desc',
        '.about__steps__item',
        '.btn',
        '.aud__desc',
        '.aud__item',
        '.aud__notice',
        '.program__desc',
        '.program__item',
        '.program__notice',
        '.outcome__desc',
        '.outcome__item',
        '.form__inner'

    ];

    // 2. Настройка наблюдателя
    const observerOptions = {
        root: null, // следим относительно окна браузера
        threshold: 0.15 // класс добавится, когда 15% элемента показалось на экране
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс visible
                entry.target.classList.add('visible');
                // Если хочешь, чтобы анимация была только один раз — "отписываемся":
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 3. Запуск: ищем все элементы по списку селекторов
    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => observer.observe(el));
    });
});