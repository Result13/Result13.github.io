


const config = JSON.parse(localStorage.getItem('rentConfig')) || {
    cpus: 0,
    power: 0,
    timeOption: 1, // 1 секунда по умолчанию
    timeLabel: '1 секунда',
    timeSelected: true,
    cost: 0,
    miningActive: false,
    miningStartTime: null,
    miningEndTime: null,
};


//pocessors
document.addEventListener('DOMContentLoaded', function () {
    const cpuDisplay = document.getElementById('cpuCountDisplay');
    const visualItems = document.querySelectorAll('#visualSelector .choose__cpu__item');
    const cpuDisplayB = document.querySelector('.profit__item:nth-child(2) .profit__title');
    const cpuInput = document.getElementById('cpuInput');
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    const MAX_CPUS = 5;

    // Функция для обновления интерфейса и объекта config
    function updateCPUCount(value) {
        // Проверяем границы
        value = Math.max(0, Math.min(value, MAX_CPUS));

        // Обновляем объект конфигурации
        config.cpus = value;

        // Обновляем текстовое отображение
        cpuDisplay.textContent = `${value} CPU${value !== 1 ? 's' : ''}`;
        cpuDisplayB.textContent = `${value} CPU${value !== 1 ? 's' : ''}`;
        // Обновляем инпут
        cpuInput.value = value;

        // Обновляем визуальные кружки
        visualItems.forEach(item => {
            const itemValue = parseInt(item.dataset.value);
            item.classList.toggle('choose__cpu__item_active', itemValue === value);
        });

        // Для отладки - можно удалить
        console.log('Текущая конфигурация:', config);
    }

    // Обработчики для визуального выбора
    visualItems.forEach(item => {
        item.addEventListener('click', () => {
            updateCPUCount(parseInt(item.dataset.value));
        });
    });

    // Обработчики для кнопок +/-
    incrementBtn.addEventListener('click', () => {
        updateCPUCount(parseInt(cpuInput.value) + 1);
    });

    decrementBtn.addEventListener('click', () => {
        updateCPUCount(parseInt(cpuInput.value) - 1);
    });

    // Инициализация
    updateCPUCount(config.cpus);
});

//power
document.addEventListener('DOMContentLoaded', function () {
    // Элементы для мощности
    const powerDisplay = document.querySelector('#power-display .base-settings__title');
    const powerInput = document.getElementById('power-input');
    const powerBottomInput = document.getElementById('power-bottom-input');
    const powerDecrementBtn = document.getElementById('power-decrement');
    const  powerDisplayB = document.querySelector('.profit__item:nth-child(3) .profit__title');
    const powerIncrementBtn = document.getElementById('power-increment');
    const powerBottomIncrementBtn = document.getElementById('power-bottom-increment');
    const MAX_POWER = 10;

    // Обновляем все элементы мощности
    function updatePower(value) {
        // Проверяем границы
        value = Math.max(0, Math.min(value, MAX_POWER));

        // Обновляем объект конфигурации
        config.power = value;

        // Обновляем отображение
        powerDisplay.textContent = `${value} GHz`;
        powerDisplayB.textContent = `${value} GHz`;
        powerInput.value = value;
        powerBottomInput.value = value;
    }

    // Обработчики для кнопок
    powerIncrementBtn.addEventListener('click', () => updatePower(config.power + 1));
    powerDecrementBtn.addEventListener('click', () => updatePower(config.power - 1));
    powerBottomIncrementBtn.addEventListener('click', () => updatePower(config.power + 1));

    // Инициализация
    updatePower(config.power);

    // Обновляем функцию для отправки на сервер
    window.getServerConfig = function () {
        return {
            processors: config.cpus,
            power: config.power, // Добавляем мощность
            timestamp: new Date().toISOString()
        };
    };
});



//time
document.addEventListener('DOMContentLoaded', function () {
    // Получаем элементы DOM
    const timeDisplay = document.getElementById('timeDisplay');
    const timeOptions = document.querySelectorAll('.choose__option[data-time]');
    const fastOption = document.getElementById('fastOption');
    const costDisplay = document.getElementById('totalCost');
    const costDisplayB = document.querySelector('.profit__item:nth-child(5) .profit__title');
    const autoBtn = document.getElementById('autoBtn');
    const rentBtn = document.getElementById('rentBtn');
    const parametersBlock = document.getElementById('parameters');
    const miningBlock = document.getElementById('mining');
    const timeDisplayB= document.querySelector('.profit__item:nth-child(1) .profit__title');
    let isAutoMode = false;
    let miningInterval;

    // ===== ФУНКЦИИ ДЛЯ РАБОТЫ СО ВРЕМЕНЕМ =====
    function updateTimeSelection(seconds, label) {
        config.timeOption = seconds;
        config.timeLabel = label;
        config.timeSelected = true;
        saveConfig();

        // Обновляем отображение времени
        if (timeDisplay) {
            timeDisplay.textContent = formatTime(seconds);
            timeDisplayB.textContent = formatTime(seconds);
        }

        // Обновляем активные элементы
        timeOptions.forEach(option => {
            option.classList.toggle('choose__option_active', option.dataset.time === seconds.toString());
        });

        if (fastOption) {
            fastOption.classList.toggle('choose__option_active', seconds === 1);
        }

        calculateTotalCost();
    }

    function formatTime(seconds) {
        if (seconds === 1) return '1 сек';
        if (seconds < 60) return `${seconds} сек`;
        if (seconds < 3600) return `${seconds / 60} мин`;
        return `${seconds / 3600} ч`;
    }

    // ===== ФУНКЦИИ ДЛЯ РАСЧЕТА СТОИМОСТИ =====
    function calculateCost() {
        if (!config.timeSelected) return 0;

        // Улучшенная формула расчета
        const baseRate = 0.15; // Базовая ставка за CPU
        const powerRate = 0.08; // Коэффициент мощности
        const minCost = 1.0; // Минимальная стоимость
        const hours = config.timeOption / 3600;

        return Math.max(
            (config.cpus * baseRate + config.power * powerRate) * hours,
            minCost
        );
    }

    function updateCostDisplay() {
        if (costDisplay) {
            costDisplay.textContent = config.cost.toFixed(2);
            costDisplayB.textContent = config.cost.toFixed(2);
        }
    }

    function calculateTotalCost() {
        config.cost = calculateCost();
        updateCostDisplay();
        saveConfig();
        return config.cost;
    }

    // ===== ФУНКЦИИ ДЛЯ МАЙНИНГА =====
    function startMining() {
        if (!validateBeforeMining()) return;

        config.miningActive = true;
        config.miningStartTime = Date.now();
        config.miningEndTime = config.miningStartTime + (config.timeOption * 1000);

        if (parametersBlock) parametersBlock.classList.remove('settings__inner_active');
        if (miningBlock) miningBlock.classList.add('settings__inner_active');

        miningInterval = setInterval(updateMiningStatus, 1000);
        saveConfig();
    }

    function stopMining() {
        config.miningActive = false;
        clearInterval(miningInterval);

        if (parametersBlock) parametersBlock.classList.add('settings__inner_active');
        if (miningBlock) miningBlock.classList.remove('settings__inner_active');

        saveConfig();
    }

    function updateMiningStatus() {
        const remaining = config.miningEndTime - Date.now();
        if (remaining <= 0) {
            stopMining();
            alert('Время аренды истекло!');
        }
        // Можно добавить обновление таймера на интерфейсе
    }

    function toggleMining() {
        if (config.miningActive) {
            stopMining();
        } else {
            startMining();
        }
    }

    // ===== ВАЛИДАЦИЯ И ПРОВЕРКИ =====
    function validateBeforeMining() {
        if (!config.timeSelected) {
            alert('Пожалуйста, выберите время аренды');
            return false;
        }
        if (config.cpus <= 0 || config.power <= 0) {
            alert('Пожалуйста, настройте процессоры и мощность');
            return false;
        }
        return true;
    }

    function checkActiveState() {
        const now = Date.now();
        const isTimeValid = config.miningEndTime && now < config.miningEndTime;

        if (config.miningActive && isTimeValid) {
            if (parametersBlock) parametersBlock.classList.remove('settings__inner_active');
            if (miningBlock) miningBlock.classList.add('settings__inner_active');
        } else {
            config.miningActive = false;
            if (parametersBlock) parametersBlock.classList.add('settings__inner_active');
            if (miningBlock) miningBlock.classList.remove('settings__inner_active');
        }
    }

    // ===== РАБОТА С ХРАНИЛИЩЕМ =====
    function saveConfig() {
        localStorage.setItem('rentConfig', JSON.stringify(config));
    }

    function loadConfig() {
        updateTimeSelection(config.timeOption, config.timeLabel);

        if (config.timeOption === 1 && fastOption) {
            fastOption.classList.add('choose__option_active');
        }

        if (autoBtn && isAutoMode) {
            autoBtn.classList.add('active');
        }

        checkActiveState();
    }

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    function setupEventListeners() {
        // Обработчики выбора времени
        timeOptions.forEach(option => {
            option.addEventListener('click', () => {
                updateTimeSelection(parseInt(option.dataset.time), option.textContent.trim());
            });
        });

        if (fastOption) {
            fastOption.addEventListener('click', () => {
                updateTimeSelection(1, '1 секунда');
            });
        }

        // Обработчики кнопок майнинга
        if (autoBtn) {
            autoBtn.addEventListener('click', function () {
                isAutoMode = !isAutoMode;
                this.classList.toggle('active', isAutoMode);
                toggleMining();
            });
        }

        if (rentBtn) {
            rentBtn.addEventListener('click', function () {
                if (isAutoMode) {
                    isAutoMode = false;
                    if (autoBtn) autoBtn.classList.remove('active');
                }
                toggleMining();
            });
        }
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    function init() {
        setupEventListeners();
        loadConfig();
        calculateTotalCost();
    }

    init();

    // ===== ГЛОБАЛЬНЫЕ МЕТОДЫ =====
    window.getServerConfig = function () {
        return {
            processors: config.cpus,
            power: config.power,
            time_option: config.timeOption,
            time_label: config.timeLabel,
            cost: config.cost,
            mining_active: config.miningActive,
            timestamp: new Date().toISOString()
        };
    };
});

// Глобальные функции для обновления параметров
function updateCPUCount(count) {
    const config = JSON.parse(localStorage.getItem('rentConfig')) || {};
    config.cpus = count;
    localStorage.setItem('rentConfig', JSON.stringify(config));
    window.dispatchEvent(new Event('configUpdated'));
}

function updatePowerValue(power) {
    const config = JSON.parse(localStorage.getItem('rentConfig')) || {};
    config.power = power;
    localStorage.setItem('rentConfig', JSON.stringify(config));
    window.dispatchEvent(new Event('configUpdated'));
}

// Глобальный обработчик обновлений
window.addEventListener('configUpdated', function () {
    const config = JSON.parse(localStorage.getItem('rentConfig')) || {};
    const costDisplay = document.getElementById('totalCost');
    if (costDisplay) {
        const hours = config.timeOption / 3600;
        const baseRate = 0.15;
        const powerRate = 0.08;
        const minCost = 1.0;
        config.cost = Math.max(
            (config.cpus * baseRate + config.power * powerRate) * hours,
            minCost
        );
        costDisplay.textContent = config.cost.toFixed(2);
        localStorage.setItem('rentConfig', JSON.stringify(config));
    }
});