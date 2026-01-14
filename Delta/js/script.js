        const metricsData = {
            cash: { name: 'Выручка', data: [100, 250, 500, 800, 700, 600, 900] },
            noneCash: { name: 'Наличные', data: [50, 120, 300, 450, 380, 520, 650] },
            credit: { name: 'Безналичный расчет', data: [200, 210, 205, 200, 210, 205, 200] },
            mediumChek: { name: 'Средний чек', data: [180, 185, 190, 188, 192, 187, 195] },
            mediumGuest: { name: 'Средний Гость', data: [1.2, 1.3, 1.25, 1.35, 1.3, 1.4, 1.28] },
            delAfter: { name: 'Удаление (после оплаты)', data: [800, 850, 900, 950, 1000, 1100, 1206] },
            delBefore: { name: 'Удаление (перед оплатой)', data: [900, 950, 1000, 1050, 1100, 1000, 1000] },
            cheks: { name: 'Количество чеков', data: [1200, 1250, 1280, 1300, 1310, 1300, 1300] },
            guests: { name: 'Количество гостей', data: [40, 38, 36, 35, 35, 36, 34] }
        };

        let chartInstance = null;

        function initChart(metric = 'cash') {
            if (typeof Highcharts === 'undefined') return;
            const data = metricsData[metric];
            if (!data) return;
            if (chartInstance) chartInstance.destroy();
            chartInstance = Highcharts.chart('chartContainer', {
                chart: { type: 'line', backgroundColor: 'transparent' },
                title: { text: null },
                xAxis: {
                    categories: ['День 1', 'День 2', 'День 3', 'День 4', 'День 5', 'День 6', 'День 7'],
                    lineColor: '#e5e7eb',
                    tickColor: '#e5e7eb',
                    labels: { style: { color: '#6b7280', fontSize: '12px' } }
                },
                yAxis: {
                    type: 'logarithmic',
                    title: { text: null },
                    gridLineColor: '#e5e7eb',
                    labels: { style: { color: '#6b7280', fontSize: '12px' } }
                },
                plotOptions: {
                    series: { marker: { radius: 4, fillColor: '#08a029ff', lineWidth: 2, lineColor: '#08a029ff' } }
                },
                tooltip: {
                    backgroundColor: '#111827',
                    borderColor: '#e5e7eb',
                    style: { color: '#fff' },
                    formatter: function() { return '<strong>' + this.series.name + '</strong><br/>' + this.x + ': ' + this.y; }
                },
                legend: { enabled: true, itemStyle: { color: '#6b7280', fontSize: '12px' } },
                series: [{ name: data.name, data: data.data, color: '#026802ff', lineWidth: 2 }],
                credits: { enabled: false },
                exporting: { enabled: false }
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            initChart('cash');
            document.querySelectorAll('.table__row').forEach(row => {
                row.addEventListener('click', function() {
                    const metric = this.getAttribute('data-metric');
                    document.querySelectorAll('.table__row').forEach(r => r.classList.remove('table__row--active'));
                    this.classList.add('table__row--active');
                    initChart(metric);
                });
            });
        });