import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Questionnaire.css';

const Questionnaire = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleOptionChange = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSave = () => {
    if (!selectedMood || Object.keys(answers).length < 12) {
      alert("Please answer all questions before submitting.");
      return;
    }
  
    // Save the selected mood to localStorage
    localStorage.setItem('selectedMood', selectedMood);
  
    const stored = JSON.parse(localStorage.getItem('questionnaireResponses')) || [];
    const entry = {
      mood: selectedMood,
      date: new Date().toISOString(),
      answers
    };
  
    localStorage.setItem('questionnaireResponses', JSON.stringify([entry, ...stored]));
    alert("Responses saved!");
    navigate('/mood-analysis');
  };
  // Immediately clear the mood after saving so MoodAnalysis shows blank next time
   setTimeout(() => {
      localStorage.removeItem('selectedMood');
    }, 100); // slight delay so MoodAnalysis can still read it once
  

  const moodQuestions = {
    happy: [
      "I feel grateful for the events of today.",
      "I shared my happiness with others.",
      "I felt an inner sense of peace and joy.",
      "I smiled or laughed frequently today.",
      "I feel motivated and full of energy.",
      "I was kind and encouraging to others.",
      "I felt loved and appreciated.",
      "I noticed the beauty in little things.",
      "I was able to enjoy the present moment.",
      "I felt proud of my achievements.",
      "I inspired someone today.",
      "I would describe today as a good day."
    ],
    sad: [
      "I felt lonely or isolated.",
      "I experienced a sense of loss or emptiness.",
      "I struggled to find motivation.",
      "I cried or felt like crying.",
      "I had trouble finding joy in things.",
      "I felt unimportant or ignored.",
      "I avoided social interactions.",
      "I blamed myself for my feelings.",
      "I felt stuck in negative thoughts.",
      "I wanted comfort or support but didn’t ask.",
      "I had low energy throughout the day.",
      "I feel like I need help dealing with my emotions."
    ],
    angry: [
      "I was irritated by small things.",
      "I expressed my anger verbally.",
      "I felt like hitting or breaking something.",
      "I had trouble controlling my emotions.",
      "I replayed the triggering event in my mind.",
      "I felt misunderstood or disrespected.",
      "I kept my anger bottled up.",
      "I directed anger toward myself.",
      "I felt justified in my anger.",
      "I felt guilt or shame about my anger.",
      "I wanted to be alone.",
      "I regret how I handled a situation today."
    ],
    excited: [
      "I’m looking forward to something special.",
      "I shared exciting news with someone.",
      "I felt butterflies of anticipation.",
      "I was more energetic than usual.",
      "I couldn’t stop smiling.",
      "I kept thinking about the future.",
      "I felt like celebrating.",
      "I talked more than usual.",
      "I was easily distracted by excitement.",
      "I expressed excitement on social media.",
      "I planned or prepared for something upcoming.",
      "I feel this excitement is meaningful."
    ],
    worried: [
      "I had racing or anxious thoughts.",
      "I overthought small decisions.",
      "I felt physically tense or uneasy.",
      "I imagined worst-case scenarios.",
      "I had trouble sleeping or relaxing.",
      "I avoided something because of worry.",
      "I talked to someone about my fears.",
      "I sought reassurance more than usual.",
      "I felt out of control.",
      "I felt overwhelmed by tasks.",
      "I found it hard to breathe calmly.",
      "I worried about things I usually handle well."
    ],
    // cry: [
    //   "I cried today or felt like crying.",
    //   "I felt emotionally overwhelmed.",
    //   "I needed to release emotions.",
    //   "I cried alone and didn’t tell anyone.",
    //   "Crying helped me feel better.",
    //   "I felt emotionally exhausted.",
    //   "I was triggered by something small.",
    //   "I felt vulnerable.",
    //   "I suppressed tears despite wanting to cry.",
    //   "I felt embarrassed about crying.",
    //   "Someone comforted me today.",
    //   "Crying was a relief."
    // ],
    tired: [
      "I lacked energy most of the day.",
      "I struggled to concentrate.",
      "I wanted to sleep or rest more.",
      "I felt mentally drained.",
      "I pushed through despite fatigue.",
      "I canceled plans due to tiredness.",
      "I felt emotionally numb.",
      "I felt burdened or heavy.",
      "I needed quiet and solitude.",
      "I questioned my ability to continue the day.",
      "I lacked motivation.",
      "I need time to recharge."
    ],
    // sarcasm: [
    //   "I used sarcasm often today.",
    //   "My sarcasm hid deeper feelings.",
    //   "I joked to avoid serious conversation.",
    //   "I felt emotionally detached.",
    //   "Others didn’t understand my sarcasm.",
    //   "I used humor as a coping mechanism.",
    //   "I feel misunderstood.",
    //   "I laughed at things I didn’t find funny.",
    //   "I masked sadness or anger with jokes.",
    //   "I downplayed my true feelings.",
    //   "I avoided vulnerability.",
    //   "I’m not sure what I’m really feeling."
    // ]
  };

  const options = [
    "Strongly Disagree",
    "Disagree",
    "Somewhat Agree",
    "Agree",
    "Strongly Agree"
  ];

  return (
    <div className="questionnaire-container">
      <h2>🧠 Mood-Based Questionnaire</h2>

      <div className="mood-select">
        <label htmlFor="mood">Select your mood: </label>
        <select
          id="mood"
          value={selectedMood}
          onChange={(e) => {
            setSelectedMood(e.target.value);
            setAnswers({});
          }}
        >
          <option value="">--Choose--</option>
          {Object.keys(moodQuestions).map(mood => (
            <option key={mood} value={mood}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {selectedMood && (
        <div className="questions-block">
          {moodQuestions[selectedMood].map((q, index) => (
            <div key={index} className="question-item">
              <h4>{q}</h4>
              {options.map((opt, i) => (
                <label key={i} className="option-label">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    value={opt}
                    checked={answers[index] === opt}
                    onChange={() => handleOptionChange(index, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button onClick={handleSave} className="save-button">
            💾 Save Responses
          </button>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
