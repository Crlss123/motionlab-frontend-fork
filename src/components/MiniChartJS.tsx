import Chart from 'chart.js/auto';
import React, { useRef, useEffect } from 'react';
import { MovementData } from '../pages/Simulador';

interface MiniChartJSProps {
    data: MovementData[];
    dataKey: keyof MovementData;
    color: string;
}

const MiniChartJS = ({ data, dataKey, color }: MiniChartJSProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Función para encontrar el tiempo cuando se completó cada meta
        const findGoalCompletionTime = (goalKey: keyof MovementData) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i][goalKey] === true) {
                    return data[i].time;
                }
            }
            return null;
        };

        // Obtener los tiempos de completación de las metas
        const goalTimes = [
            { time: findGoalCompletionTime('isGoalOneCompleted'), label: 'M1', color: '#FF6B6B' },
            { time: findGoalCompletionTime('isGoalTwoCompleted'), label: 'M2', color: '#50d297ff' },
            { time: findGoalCompletionTime('isGoalThreeCompleted'), label: 'M3', color: '#45B7D1' }
        ].filter(goal => goal.time !== null);

        const chartData = {
            labels: data.map(d => d.time?.toFixed(1) || '0'),
            datasets: [{
                data: data.map(d => d[dataKey] as number),
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 0
            }]
        };

        // Plugin personalizado para dibujar las líneas de las metas
        const goalMarkerPlugin = {
            id: 'goalMarkerPlugin',
            afterDraw: (chart: Chart) => {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                const xScale = chart.scales.x;
                const yScale = chart.scales.y;

                goalTimes.forEach((goal) => {
                    if (goal.time === null) return;
                    
                    // Encontrar la posición x del tiempo de la meta
                    const timeLabel = goal.time.toFixed(1);
                    const labelIndex = chart.data.labels?.indexOf(timeLabel);
                    
                    if (labelIndex !== undefined && labelIndex !== -1) {
                        // Calcular la posición x en pixels
                        const xPos = xScale.getPixelForValue(labelIndex);
                        
                        // Dibujar línea vertical
                        ctx.save();
                        ctx.setLineDash([5, 5]);
                        ctx.strokeStyle = goal.color;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(xPos, chartArea.top);
                        ctx.lineTo(xPos, chartArea.bottom);
                        ctx.stroke();
                        ctx.restore();
                        
                        // Dibujar etiqueta
                        ctx.save();
                        ctx.fillStyle = goal.color;
                        ctx.font = '5px Arial';
                        ctx.textAlign = 'center';
                        
                        // Fondo del texto
                        const textWidth = ctx.measureText(goal.label).width + 4;
                        const textHeight = 12;
                        ctx.fillRect(xPos - textWidth/2, chartArea.top - textHeight - 2, textWidth, textHeight);
                        
                        // Texto
                        ctx.fillStyle = 'white';
                        ctx.fillText(goal.label, xPos, chartArea.top - 4);
                        ctx.restore();
                    }
                });
            }
        };

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: chartData,
            plugins: [goalMarkerPlugin],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        display: true,
                        grid: { display: true, color: '#e0e0e0' },
                        ticks: { font: { size: 8 } }
                    },
                    y: {
                        display: true,
                        grid: { display: true, color: '#e0e0e0' },
                        ticks: { font: { size: 8 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, dataKey, color]);

    return (
        <div style={{ height: '140px', width: '100%' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default MiniChartJS;