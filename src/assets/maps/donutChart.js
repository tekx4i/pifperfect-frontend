import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DonutChart = () => {
    const data = {
        labels: ["Complete", "In Process"],
        datasets: [
            {
                data: [80, 20], // Complete: 80%, In Process: 20%
                backgroundColor: ["#00D5D2", "#E0F7F5"], // Colors for the sections
                hoverBackgroundColor: ["#00B3AF", "#C5F0ED"], // Hover colors
                borderWidth: 0, // No border for cleaner design
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    font: {
                        size: 12,
                    },
                    usePointStyle: true,
                },
            },
            // title: {
            //     display: true,
            //     text: "Sales Goal",
            //     font: {
            //         size: 18,
            //         weight: "bold",
            //     },
            // },
        },
        cutout: "70%", // Creates the donut effect
    };

    return (
        <div
            style={{
                width: "300px",
                margin: "0 auto",
                textAlign: "center",
                padding: "20px",
                // border: "1px solid #e5e5e5",
                borderRadius: "12px",
                // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                position: "relative", // Make the container relative
            }}
        >
            <Doughnut data={data} options={options} />
            <div
                style={{
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    pointerEvents: "none", // Prevent the text from interfering with mouse events
                }}
            >
                <h2 style={{ fontSize: "32px", margin: 0, color: "#00D5D2" }}>
                    80%
                </h2>
                <p style={{ fontSize: "14px", margin: 0, color: "#555" }}>
                    Sales Completed
                </p>
            </div>
        </div>
    );
};

export default DonutChart;
