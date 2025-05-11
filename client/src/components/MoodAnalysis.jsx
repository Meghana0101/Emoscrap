import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../MoodAnalysis.css';
  // Recommendation sets for each mood
  const moodRecommendations = {
    happy: [
      {
        book: { name: "Happy-ikigai", link: "https://ia801904.us.archive.org/32/items/ikigai-the-japanese-secret-to-a-long-and-happy-life-pdfdrive.com/Ikigai%20_%20the%20Japanese%20secret%20to%20a%20long%20and%20happy%20life%20%28%20PDFDrive.com%20%29.pdf " },
        activity: { name: "A happiness guide..", link: "https://youtu.be/Kk0-cCrJDG8?si=fZD3jbFFUJToRs3v" },
        playlist: { name: "Happy Hits", link: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0?si=QKStY2spRA2acDdHMzKb7A%0A " },
        affirmation: "You're doing amazing!,keep up this spirit and energy..",}
    ],
    sad: [
      {
        book: { name: "Atomic Habits", link: "https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/080701429X" },
        activity: { name: "Hope this activity helps you feel better .Click on the link to redirect to the activity", link: "https://youtu.be/qKcRUOWYQ9w?si=8tg9hov05YRQw_qD" },
        playlist: { name: "Reflection Music", link: "https://open.spotify.com/playlist/25ZzkJkOuYir9kHr2CqwPQ?si=IqXPW4pySneaIay85WrRhA " },
        affirmation: "Your strength will carry you through these difficult times.",
      },
    ],
    angry: [
      {
        book: { name: "Never get angry again!", link: "https://m.vk.com/wall-48395307_23943" },
        activity: { name: "Go for a calming walk", link: "https://www.alltrails.com/" },
        playlist: { name: "Calm Beats", link: "https://open.spotify.com/playlist/6F0JjEHDSKY2e75SoOhBgj?si=imhtqahRRc6rypqeIko3kA " },
        affirmation: "You are not your anger. Let it flow and let it go.",
      },
    ],
    excited: [
      {
        book: { name: "The Happiness Project", link: "https://gretchenrubin.com/wp-content/uploads/2017/09/The-Happiness-Project-Sample-Chapter.pdf " },
        activity: { name: "Push yourself to new limits", link: "https://www.strava.com" },
        playlist: { name: "Energetic Beats", link: "https://open.spotify.com/playlist/4KfJccfGchz4uOOPAlxKkz?si=7NVN4SKhTGaemEt_F0_btw " },
        affirmation: "You're unstoppable! Keep the momentum going...",
      },
    ],
    worried: [
      {
        book: { name: "How To Stop Worrying And Start Living", link: "https://crpf.gov.in/writereaddata/images/pdf/How_To_Stop_Worrying_And_Start_Living.pdf" },
        activity: { name: "Hope this activity helps you feel better... ", link: "https://youtu.be/yqR77sa4EVE?si=g6YGuxD6HayqBIy0" },
        playlist: { name: "Peaceful Mind", link: "https://open.sphttps://open.spotify.com/playlist/1MFQ4K3kEJUaSrWsX5ZfPn?si=fJgiyHB5Qhyzm0yUbyi2MA otify.com/playlist/37i9dQZF1DXdfZ3zld7dQ8" },
        affirmation: "You are not your worries. Let go and trust the process,every thing will be alright .",
      },
    ],
    
    tired: [
      {
        book: { name: "I'm So Effing Tired", link: "https://www.amazon.com/Power-Rest-Discover-Health-Rejuvenating/dp/0399177049https://cdn.bookey.app/files/pdf/book/en/i'm-so-effing-tired.pdf" },
        activity: { name: "Sound therapy", link: "https://youtube.com/shorts/7hJvua53HEM?si=4m8CKl2GVRfr0vwZ" },
        playlist: { name: "Rest & Rejuvenate", link: "https://open.spotify.com/playlist/0BJv1HBSB7ksaDyfBWuJfL?si=S9OTLcVxS6y_3qN6rDzcvA " },
        affirmation: "Rest is essential for a productive tomorrow.all you need is a good nap and geat meal to get back that energy..",
      },
    ],
   
  };

  
const MoodAnalysis = () => {
  const [mood, setMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const savedMood = localStorage.getItem('selectedMood');
    if (savedMood) {
      setMood(savedMood);
    }
  }, []);

  useEffect(() => {
    if (mood) {
      setRecommendations(moodRecommendations[mood] || []);
    }
  }, [mood]);
  return (
    <div className="mood-analysis-container">
      <h2>Your Mood Analysis</h2>
      {mood ? (
        <>
          <p><strong>Selected Mood:</strong> {mood}</p>
          {recommendations.length > 0 ? (
            <div className="recommendation-section">
              <div className="recommendation-wrapper">
                {/* Map through the recommendation objects (usually just one) */}
                {recommendations.map((rec, index) => (
                  <React.Fragment key={index}>
                    {/* Read */}
                    <div className="recommendation-packet">
                      <div className="recommendation-header">
                        <i className="bi bi-book"></i>
                        <h5>Read</h5>
                        <p>A classic book recomendation for your current mood...</p>
                      </div>
                      <div className="recommendation-body">
                        <p>
                          <a href={rec.book.link} target="_blank" rel="noopener noreferrer">
                            {rec.book.name}
                          </a>
                        </p>
                      </div>
                    </div>
  
                    {/* Listen */}
                    <div className="recommendation-packet">
                      <div className="recommendation-header">
                        <i className="bi bi-music-note-beamed"></i>
                        <h5>Listen</h5>
                        <p>A perfect playlist to uplift your mood!</p>
                      </div>
                      <div className="recommendation-body">
                        <p>
                          <a href={rec.playlist.link} target="_blank" rel="noopener noreferrer">
                            {rec.playlist.name}
                          </a>
                        </p>
                      </div>
                    </div>
  
                    {/* Do */}
                    <div className="recommendation-packet">
                      <div className="recommendation-header">
                        <i className="bi bi-brush"></i>
                        <h5>Do </h5>
                        <p>Here is and activity for you today!</p>
                      </div>
                      <div className="recommendation-body">
                        <p>
                          <a href={rec.activity.link} target="_blank" rel="noopener noreferrer">
                            {rec.activity.name}
                          </a>
                        </p>
                      </div>
                    </div>
  
                    {/* Affirm */}
                    <div className="recommendation-packet">
                      <div className="recommendation-header">
                        <i className="bi bi-chat-square-heart"></i>
                        <h5>Words of Affrimation</h5>
                      </div>
                      <div className="recommendation-body">
                        <p>{rec.affirmation}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p>No recommendations available for this mood.</p>
          )}
        </>
      ) : (
        <p>No mood selected. Please go back and select your mood.</p>
      )}
    </div>
  );
  
};

export default MoodAnalysis;