import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Bar } from 'react-chartjs-2';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, parseISO, eachDayOfInterval } from 'date-fns';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../TrackMood.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const emotionColors = {
  admiration: '#FF69B4',
  amusement: '#FFD700',
  anger: '#FF4500',
  annoyance: '#FF8C00',
  approval: '#32CD32',
  caring: '#FF1493',
  confusion: '#9370DB',
  curiosity: '#20B2AA',
  desire: '#FF69B4',
  disappointment: '#808080',
  disapproval: '#8B0000',
  disgust: '#006400',
  embarrassment: '#FFB6C1',
  excitement: '#FF4500',
  fear: '#4B0082',
  gratitude: '#98FB98',
  grief: '#2F4F4F',
  joy: '#FFD700',
  love: '#FF69B4',
  nervousness: '#DDA0DD',
  neutral: '#A9A9A9',
  optimism: '#98FB98',
  pride: '#FFD700',
  realization: '#87CEEB',
  relief: '#98FB98',
  remorse: '#8B0000',
  sadness: '#4169E1',
  surprise: '#FFD700'
};

const TrackMood = () => {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);
  const [activeView, setActiveView] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const userId = localStorage.getItem('userId');
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/entries/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEntries(response.data);
    } catch (err) {
      setError('Failed to fetch entries');
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEntries = (mode) => {
    if (!mode) return [];

    const baseDate = new Date(selectedDate);
    if (mode === 'daily') {
      return entries.filter(entry => isSameDay(new Date(entry.date), baseDate));
    } else if (mode === 'weekly') {
      const start = startOfWeek(baseDate);
      const end = endOfWeek(baseDate);
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    } else if (mode === 'monthly') {
      const start = startOfMonth(baseDate);
      const end = endOfMonth(baseDate);
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    }
    return [];
  };

  const getProcessedData = (emotions) => {
    console.log(emotions)
    const resultData = []
    for (const key in emotions) {
      const emotion = emotions[key]
      let value = 3;
      switch(emotion['sentiment']) {
        case 'postive':
          value = 3;
          break;
        case 'negative':
          value = 1;
          break;
        case 'neutral':
          value=2;
      }
      resultData.push({
        date: emotion['date'],
        value: value
      })
    }
    return resultData;
  }

  const convertIntoWeeklyData = (data) => {
    if (!data.length) return [];
  
    // Sort the data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
    // Detect the month & year from the first date in the list
    const firstDate = new Date(sortedData[0].date);
    const targetMonth = firstDate.getMonth(); // 0-based (0 = Jan)
    const targetYear = firstDate.getFullYear();

    const weekMap = new Map([[1, []], [2, []], [3, []], [4, []]]);
    const weekRanges = [
      { start: 1, end: 7 },    // Week 1
      { start: 8, end: 14 },   // Week 2
      { start: 15, end: 21 },  // Week 3
      { start: 22, end: 28 }   // Week 4
    ];

    for (const { date, value } of data) {
      const d = new Date(date);
      const month = d.getMonth();
      const year = d.getFullYear();

      if (month === targetMonth && year === targetYear) {
        const day = d.getDate();
        for (let i = 0; i < weekRanges.length; i++) {
          const { start, end } = weekRanges[i];
          if (day >= start && day <= end) {
            weekMap.get(i + 1).push(value);
            break;
          }
        }
      }
    }

    const result = [];
    for (let week = 1; week <= 4; week++) {
      const values = weekMap.get(week);
      const sum = values.reduce((acc, v) => acc + v, 0);
      const avg = values.length ? Math.round(sum / values.length) : 0;
      result.push({ date: `Week ${week}`, value: avg });
    }
    return result;
  }

  const showGraph = async (mode) => {
    setActiveView(mode);
    const filtered = getFilteredEntries(mode);
    if (filtered.length === 0) {
      setChartData(null);
      return;
    }
    const constructedData = filtered
    .map(({ date, text }) => ({ date, text }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

    try {
      setLoading(true);
      // Send entries to ML model for analysis
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/emotions/classify`,
        { entries: constructedData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      
     
      let result = getProcessedData(response.data.emotions)
      
      if(mode == 'monthly') {
        result = convertIntoWeeklyData(result)
      }

      setChartData({
        labels: result.map(item => item.date),
        datasets: [{
          label: 'Emotion Value',
          data: result.map(item => item.value),
          backgroundColor: 'blue',
          borderColor: 'blue',
          borderWidth: 1
        }]
      });

      console.log(chartData)
      
    } catch (err) {
      console.error('Error analyzing mood:', err);
      setError('Failed to analyze mood data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="track-mood-container">
      <div className="calendar-container">
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <div className="graph-section">
        <h2>📊 Track Your Mood</h2>

        <div className="button-group">
          <button onClick={() => showGraph('daily')}>Daily</button>
          <button onClick={() => showGraph('weekly')}>Weekly</button>
          <button onClick={() => showGraph('monthly')}>Monthly</button>
        </div>

        {activeView && <h4>{activeView.charAt(0).toUpperCase() + activeView.slice(1)} Mood View</h4>}

        {chartData ? (
          <div className="graph-container">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: "Here's how  your mood  was lately"
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'your emotion graph'
                    },
                    min: 0,
                    max: 3,
                    ticks: {
                      stepSize: 1,
                      callback: function (value) {
                        const moodMap = {
                          0: ' ',
                          1: 'Negative',
                          2: 'Neutral',
                          3: 'Positive'
                        };
                        return moodMap[value] || value;
                      }
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  }
                }
              }}
            />
          </div>
        ) : (
          activeView && <p>Your dairy entry is not available fro the selected time period!!</p>
        )}
      </div>
    </div>
  );
};

export default TrackMood;
