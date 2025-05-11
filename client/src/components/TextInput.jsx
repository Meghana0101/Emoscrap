import { useState } from 'react';
import axios from 'axios';

function TextInput() {
  const [text, setText] = useState('');
  const [emotions, setEmotions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/emotions/predict`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmotions(res.data.labels);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/entries`,
        { text, emotions: res.data.labels },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h3>Enter Today's Text</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What was your day like today?"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {emotions.length > 0 && (
        <p>Detected Emotions: {emotions.join(', ')}</p>
      )}
    </div>
  );
}

export default TextInput;
