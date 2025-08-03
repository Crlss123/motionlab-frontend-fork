import { Chart } from 'chart.js';
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

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: chartData,
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
