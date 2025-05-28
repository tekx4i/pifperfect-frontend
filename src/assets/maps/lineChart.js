import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = () => {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

        datasets: [
            {
                label: "$100K+ Sales",
                data: [10, 20, 30, 40, 30, 20, 30, 40, 30, 20, 30, 40],
                borderColor: "#00cfe8",
                backgroundColor: "rgba(0, 207, 232, 0.2)",
                tension: 0.4,
            },
            {
                label: ">25% Net Profit",
                data: [15, 25, 35, 30, 40, 25, 35, 25, 35, 30, 25, 45],
                borderColor: "#ffdc00",
                backgroundColor: "rgba(255, 220, 0, 0.2)",
                tension: 0.4,
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
                    size: 15,  // Adjust the font size of the legend labels
                    weight:400,
                },
            },
            },
            title: {
                display: true,
                text: "Overview",
                font: {
                    size: 22,
                    weight: "600",
                },
                align: "start",
            },
        },
        layout: {
            padding: {
                top: 20,
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 18, // Increase font size for x-axis labels
                    },
                    color: "#333", // Optional: Change font color for x-axis labels
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 18, // Increase font size for y-axis labels
                    },
                    color: "#333", // Optional: Change font color for y-axis labels
                },
            },
        },
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

            <div style={{ width: "90%" }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default LineChart;
