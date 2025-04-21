document.addEventListener('DOMContentLoaded', function () {
    // Маска для номера карты: 0000 0000 0000 0000
    IMask(document.getElementById('card-number'), {
        mask: '0000 0000 0000 0000'
    });

    // Маска для срока действия: MM/YY


    // Маска для CVC: 3 цифры
    IMask(document.getElementById('card-cvc'), {
        mask: '000'
    });

    // Маска для суммы: только числа, максимум 7 цифр
    IMask(document.getElementById('card-amount'), {
        mask: Number,
        scale: 2,
        signed: false,
        thousandsSeparator: ' ',
        padFractionalZeros: false,
        normalizeZeros: true,
        radix: '.'
    });



    const cardDateInput = document.getElementById('card-date');

    const dateMask = IMask(cardDateInput, {
        mask: '00{/}00',
        lazy: false,
        blocks: {
            // Просто 2 числа по 2 цифры, а не строгое ограничение
            '00': {
                mask: IMask.MaskedRange,
                from: 0,
                to: 99
            }
        },
        prepare: (str) => str.replace(/[^\d]/g, ''), // только цифры
    });

    dateMask.on('accept', function () {
        const [mm, yy] = dateMask.value.split('/');
        const month = parseInt(mm, 10);
        const year = parseInt(yy, 10);

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear() % 100;

        let isValid = true;

        if (!month || month < 1 || month > 12) {
            isValid = false;
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            isValid = false;
        }

        if (!isValid) {
            cardDateInput.classList.add('input-error');
            cardDateInput.setCustomValidity('Некорректная дата');
        } else {
            cardDateInput.classList.remove('input-error');
            cardDateInput.setCustomValidity('');
        }
    });

});