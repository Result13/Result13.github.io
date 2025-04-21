document.addEventListener('DOMContentLoaded', function () {
    try {
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('passwordInput');
        const eyeIcon = document.getElementById('eyeIcon');

        // Проверяем, что все элементы существуют
        if (!togglePassword || !passwordInput || !eyeIcon) {
            throw new Error('Один или несколько необходимых элементов не найдены на странице');
        }

        togglePassword.addEventListener('click', function () {
            try {
                // Переключаем тип поля ввода
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Меняем иконку
                if (type === 'text') {
                    eyeIcon.src = './pictures/eye.svg'; // Иконка открытого глаза
                    eyeIcon.alt = 'hide-password';
                } else {
                    eyeIcon.src = './pictures/Eye-off.svg'; // Иконка закрытого глаза
                    eyeIcon.alt = 'show-password';
                }
            } catch (error) {
                console.error('Ошибка при переключении видимости пароля:', error);
            }
        });
    } catch (error) {
        console.error('Ошибка инициализации скрипта:', error);
        // Можно добавить дополнительную обработку ошибки, например показать сообщение пользователю
    }


    document.getElementById("registerBtn").addEventListener("click", function () {
        const checkbox = document.getElementById("confirm");
        const errorElement = document.getElementById("policyError");

        if (!checkbox.checked) {
            errorElement.style.display = "block";
            checkbox.focus(); // Фокусируемся на чекбоксе
            return;
        }

        window.location.href = "/unibit/server.html";
    });

    // Скрываем ошибку при клике на чекбокс
    document.getElementById("policyCheckbox").addEventListener("change", function () {
        document.getElementById("policyError").style.display = "none";
    });
});