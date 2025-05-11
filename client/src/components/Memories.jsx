import React, { useEffect, useState } from 'react';
import '../Memories.css';

const Memories = () => {
  const [memories, setMemories] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    const storedMemories = JSON.parse(localStorage.getItem('diaryArchives')) || {};
    const storedImages = JSON.parse(localStorage.getItem('memoryImages')) || {};
    setMemories(storedMemories);
    setImages(storedImages);
  }, []);

  const handleFileUpload = (date, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = { ...images, [date]: reader.result };
      setImages(updated);
      localStorage.setItem('memoryImages', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="memories-container">
      <h2>📚 Your Archived Memories</h2>

      {Object.keys(memories).length === 0 ? (
        <p>No memories yet. Highlight and archive a diary snippet to start saving!</p>
      ) : (
        Object.entries(memories).map(([date, snippets], i) => (
          <div key={i} className="memory-date-block">
            <h4>{date}</h4>
            {images[date] && <img src={images[date]} alt="Memory" className="memory-photo" />}
            <ul>
              {snippets.map((s, idx) => (
                <li key={idx} className="memory-snippet">“{s}”</li>
              ))}
            </ul>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(date, e.target.files[0])}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Memories;
