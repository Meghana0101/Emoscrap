import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Diary.css';

const Diary = () => {
  const [entryText, setEntryText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entryDates, setEntryDates] = useState([]);

  useEffect(() => {
    fetchEntryDates();
  }, []);

  const fetchEntryDates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/entries/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const dates = response.data.map(entry => new Date(entry.date).toLocaleDateString('en-CA'));
      setEntryDates(dates);
    } catch (err) {
      console.error('Error fetching entry dates:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to fetch entries. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEntryByDate = async (date) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) {
        setError('Authentication required. Please log in.');
        return null;
      }

      const formattedDate = date.toLocaleDateString('en-CA');
      console.log('2', formattedDate)
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/entries/${userId}/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      console.error('Error fetching entry:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to fetch entry. Please try again later.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!entryText.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }


      const existingEntry = await fetchEntryByDate(selectedDate);

      const entryData = {
        text: entryText,
        date: selectedDate.toLocaleDateString('en-CA'),
        id: existingEntry ? existingEntry._id : null
      };
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/entries/${userId}`,
        entryData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchEntryDates();
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving entry:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to save entry. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    if (!date) return;
    setSelectedDate(date);
    setLoading(true);

    try {
      console.log('1',date)
      const entry = await fetchEntryByDate(date);
      if (entry) {
        setEntryText(entry.text);
        setIsEditing(false);
      } else {
        setEntryText('');
        setIsEditing(true);
      }
    } catch (err) {
      console.error('Error loading entry:', err);
      setError('Failed to load entry. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = d =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="diary-container">
      <aside className="sidebar">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>&lt;</button>
          <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>&gt;</button>
        </div>
        <div className="days-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="day-header">{d}</div>
          ))}
          {calendarDays.map((date, i) => {
            const key = date?.toLocaleDateString('en-CA');
            const hasEntry = date && entryDates.includes(key);
            const isToday = date && date.toDateString() === new Date().toDateString();
            const isSel = date && date.toDateString() === selectedDate.toDateString();
            return (
              <div
                key={i}
                className={[
                  'day-cell',
                  !date && 'empty',
                  isToday && 'today',
                  hasEntry && 'has-entry',
                  isSel && 'selected'
                ].filter(Boolean).join(' ')}
                onClick={() => handleDateSelect(date)}
              >
                {date?.getDate()}
              </div>
            );
          })}
        </div>
      </aside>

      <section className="diary-main">
        <header className="entry-header">
          <h2>{formatDate(selectedDate)}</h2>
        </header>

        {isEditing ? (
          <div className="editor-container">
            <textarea
              className="entry-text"
              value={entryText}
              onChange={e => setEntryText(e.target.value)}
              placeholder="Write your diary entry here..."
              autoFocus
            />
            <div className="entry-actions">
              <button onClick={handleSave} disabled={!entryText?.trim()}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="view-container">
            {entryText ? (
              <>
                <div className="entry-content">
                  <p>{entryText}</p>
                </div>
                <div className="entry-actions">
                  <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
                </div>
              </>
            ) : (
              <div className="prompt-box">
                <h3>No entry for this day</h3>
                <button onClick={() => setIsEditing(true)} className="start-writing-button">
                  Start Writing
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Diary;
