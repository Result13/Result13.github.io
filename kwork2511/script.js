document.addEventListener("DOMContentLoaded", () => {
    const timeElement = document.querySelector(".time");
    const dayElement = document.querySelector(".day");
    const dateElement = document.querySelector(".date");
  
    const updateTime = () => {
      // Получаем текущее московское время
      const now = new Date();
      const moscowTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
  
      // Добавляем 1 час к московскому времени
      moscowTime.setHours(moscowTime.getHours() + 1);
  
      // Получаем часы и минуты
      const hours = moscowTime.getHours().toString().padStart(2, "0");
      const minutes = moscowTime.getMinutes().toString().padStart(2, "0");
  
      // Подстановка времени
      timeElement.textContent = `${hours}:${minutes}`;
  
      // Массив дней недели
      const daysOfWeek = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота"
      ];
      const dayOfWeek = daysOfWeek[moscowTime.getDay()];
      dayElement.textContent = dayOfWeek;
  
      // Форматирование даты
      const day = moscowTime.getDate().toString().padStart(2, "0");
      const month = (moscowTime.getMonth() + 1).toString().padStart(2, "0");
      const year = moscowTime.getFullYear();
      dateElement.textContent = `${day}.${month}.${year}`;
    };
  
    // Обновление времени сразу при загрузке
    updateTime();
  
    // Обновление каждую минуту
    setInterval(updateTime, 60000);
  });
  