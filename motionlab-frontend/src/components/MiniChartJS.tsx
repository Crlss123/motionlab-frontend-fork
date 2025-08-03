import { Chart } from 'chart.js';
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