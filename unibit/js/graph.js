document.addEventListener('DOMContentLoaded', function () {
 /*    const ctx = document.getElementById('profitChart').getContext('2d');

  // градиент под твою схему: от оранжевого к прозрачному
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(255, 161, 1, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 161, 1, 0.05)');

  // тестовые данные (заменятся API потом)
  const labels = ['12:51:13','12:51:14','12:51:15','12:51:16','12:51:17','12:51:18','12:51:19','12:51:20','12:51:21','12:51:22','12:51:23','12:51:24','12:51:25'];
  const values = [2, 2, 10, 20, 2, 2, 12, 2, 2, 15, 15, 2, 2];

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Авто-режим',
        data: values,
        fill: true,
        backgroundColor: gradient,
        borderColor: 'rgba(255, 161, 1, 1)', // цвет линии
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff', // белые точки
        pointBorderColor: 'rgba(255, 161, 1, 1)', // оранжевый бордер у точек
        pointHoverRadius: 6,
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { color: '#444' },
          ticks: { color: '#ccc' }
        },
        y: {
          grid: { color: '#444' },
          ticks: { color: '#ccc' }
        }
      },
      elements: {
        line: {
          borderJoinStyle: 'round',
        }
      }
    },
    plugins: [{
      // эффект свечения под цвет линии
      id: 'glow',
      beforeDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = 'rgba(255, 161, 1, 1)';
        ctx.shadowBlur = 10;
      },
      afterDraw(chart) {
        chart.ctx.restore();
      }
    }]
  }); */
  const canvas = document.getElementById('profitChart');
  const ctx = canvas.getContext('2d');

  let labels = [];
  let values = [];

  const initialGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  initialGradient.addColorStop(0, 'rgba(255, 161, 1, 0.3)');
  initialGradient.addColorStop(1, 'rgba(255, 161, 1, 0.05)');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values,
        fill: true,
        backgroundColor: initialGradient,
        borderColor: 'rgba(255, 161, 1, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: 'rgba(255, 161, 1, 1)',
        pointHoverRadius: 6,
      }]
    },
    options: {
      animation: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: '#444' },
          ticks: { color: '#ccc' }
        },
        y: {
          grid: { color: '#444' },
          ticks: { color: '#ccc' },
          beginAtZero: true
        }
      }
    },
    plugins: [{
      id: 'glow',
      beforeDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = 'rgba(255, 161, 1, 1)';
        ctx.shadowBlur = 10;
      },
      afterDraw(chart) {
        chart.ctx.restore();
      }
    }]
  });

  function getRandomValue(prev = 0) {
    const change = Math.random() * 10 - 5;
    const next = Math.max(0, prev + change);
    return Math.round(next * 10) / 10;
  }

  let lastValue = 2;

  setInterval(() => {
    try {
      const newLabel = new Date().toLocaleTimeString().split(':').slice(1).join(':');
      const newValue = getRandomValue(lastValue);
      lastValue = newValue;

      labels.push(newLabel);
      values.push(newValue);

      if (labels.length > 20) {
        labels.shift();
        values.shift();
      }

      // пересоздаём градиент по актуальной высоте
      const newGradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
      newGradient.addColorStop(0, 'rgba(255, 161, 1, 0.3)');
      newGradient.addColorStop(1, 'rgba(255, 161, 1, 0.05)');
      chart.data.datasets[0].backgroundColor = newGradient;

      chart.update();
    } catch (e) {
      console.error('Ошибка при обновлении графика:', e);
    }
  }, 1000);
  
}) 