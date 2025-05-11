import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function WeeklyReport() {
  const [emotionData, setEmotionData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/entries/weekly`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmotionData(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: Object.keys(emotionData),
    datasets: [
      {
        data: Object.values(emotionData),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#C9CBCF', '#E7E9ED', '#ADFF2F', '#FF4500',
        ],
      },
    ],
  };

  return (
    <div>
      <h3>Weekly Emotion Report</h3>
      {Object.keys(emotionData).length > 0 ? (
        <Pie data={data} />
      ) : (
        <p>No data for this week.</p>
      )}
    </div>
  );
}

export default WeeklyReport;
