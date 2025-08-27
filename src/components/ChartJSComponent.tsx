import Chart from 'chart.js/auto';
import React, { useRef, useEffect } from 'react';
import { MovementData } from '../pages/Simulador';

interface ChartJSComponentProps {
    data: MovementData[];
    dataKey: keyof MovementData;
    color: string;
    title: string;
    unit: string;
}

const ChartJSComponent = ({ data, dataKey, color, title, unit }: ChartJSComponentProps) => {
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
            { time: findGoalCompletionTime('isGoalOneCompleted'), label: 'Meta 1', color: '#FF6B6B' },
            { time: findGoalCompletionTime('isGoalTwoCompleted'), label: 'Meta 2', color: '#50d297ff' },
            { time: findGoalCompletionTime('isGoalThreeCompleted'), label: 'Meta 3', color: '#45B7D1' }
        ].filter(goal => goal.time !== null);

        const chartData = {
            labels: data.map(d => d.time?.toFixed(1) || '0'),
            datasets: [{
                label: title,
                data: data.map(d => d[dataKey] as number),
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        };

        // Plugin personalizado para dibujar los marcadores de las metas
        const goalMarkerPlugin = {
            id: 'goalMarkerPlugin',
            afterDraw: (chart: Chart) => {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                const xScale = chart.scales.x;
                
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
                        ctx.setLineDash([8, 4]);
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
                        ctx.font = 'bold 11px Arial';
                        ctx.textAlign = 'center';
                        
                        // Fondo del texto
                        const textWidth = ctx.measureText(goal.label).width + 8;
                        const textHeight = -30;
                        ctx.fillRect(xPos - textWidth/2, chartArea.top - textHeight -5, textWidth, textHeight);
                        
                        // Texto
                        ctx.fillStyle = 'white';
                        ctx.fillText(goal.label, xPos, chartArea.top + 7);
                        
                        // Mostrar tiempo en la etiqueta
                        ctx.fillStyle = 'white';
                        ctx.font = '9px Arial';
                        ctx.fillText(`(${goal.time.toFixed(1)}s)`, xPos, chartArea.top + 20);
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
                        title: {
                            display: true,
                            text: 'Tiempo (s)',
                            font: { size: 12 }
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: `${title} (${unit})`,
                            font: { size: 12 }
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                return `${title}: ${context.parsed.y.toFixed(2)} ${unit}`;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, dataKey, color, title, unit]);

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ChartJSComponent;
