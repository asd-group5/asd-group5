import React, { useState } from 'react';
import '/Users/aryan/Documents/asd-group5/frontend/src/Feedback.css'; // Link to CSS for styling

function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (can replace with API call)
    setMessage('Thank you for your feedback!');
    setFeedback('');
  };

  return (
    <div className="feedback-form">
      <h2>Leave Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Feedback;
