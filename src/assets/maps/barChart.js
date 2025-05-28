import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = () => {
    const data = {
        labels: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"],
        datasets: [
            {
                label: "$100K+ Sales",
                data: [10, 0, 0, 40, 0, 0, 30, 0, 0],
                backgroundColor: "#00D5D2",
                borderRadius: 10,
                barThickness: 60, 
            },
            {
                label: ">25% Net Profit",
                data: [0, 25, 0, 0, 40, 0, 0, 25, 0],
                backgroundColor: "#F9E844",
                borderRadius: 10,
                barThickness: 60, 
            },
            {
                label: "40 Good Deliveries",
                data: [0, 0, 35, 0, 0, 25, 0, 0, 35],
                backgroundColor: "#FF874E",
                borderRadius: 10,
                barThickness: 60, 
            },
        ],
    };
    

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 18,
                    },
                },
            },
            title: {
                display: true,
                text: "Sales Overview",
                font: {
                    size: 22,
                    weight: "bold",
                },
                align: "start",
            },
        },
        scales: {
            x: {
                stacked: true, // Stack bars on the x-axis
                ticks: {
                    font: {
                        size: 16, // Font size for x-axis labels
                    },
                    color: "#333", // Optional: Set label color
                },
                barThickness: 10, // Reduce the bar width (thickness)
            },
            y: {
                stacked: true,
                ticks: {
                    font: {
                        size: 16, // Font size for y-axis labels
                    },
                    color: "#333", // Optional: Set label color
                },
            },
        },
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "90%" }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default BarChart;
