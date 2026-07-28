```js
import "./FeedbackModal.css";
import React, { useState } from "react";

const FeedbackModal = ({ isOpen, onClose }) => {
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');
    const [rating, setRating] = useState(null);

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
        setError(''); // Clear error on input change
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedback.trim()) {
            setError('Feedback cannot be empty.');
            return;
        }
        if (rating === null) {
            setError('Please select a rating.');
            return;
        }

        // Submit feedback (replace this with an API call)
        console.log('Feedback submitted:', { feedback, rating });
        onClose(); // Close the modal after submission
    };

    const handleRatingClick = (value) => {
        setRating(value);
        setError(''); // Clear error on rating selection
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Feedback</h2>
                <form onSubmit={handleSubmit}>
                    <div className="rating">
                        <p>Please rate your experience:</p>
                        {[...Array(10)].map((_, index) => (
                            <span
                                key={index}
                                className={`emoji ${rating === index + 1 ? 'selected' : ''}`}
                                onClick={() => handleRatingClick(index + 1)}
                            >
                                {index + 1} {index + 1 <= 5 ? '😢' : '😊'}
                            </span>
                        ))}
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <textarea
                        value={feedback}
                        onChange={handleFeedbackChange}
                        placeholder="Your feedback here..."
                        rows="5"
                        required
                    />
                    <div className="button-group">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
}

textarea {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.error-message {
    color: red;
    font-size: 0.875em;
}

.button-group {
    margin-top: 20px;
}

button {
    padding: 10px 15px;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button[type="button"] {
    background-color: #ccc;
}

.rating {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.emoji {
    cursor: pointer;
    font-size: 1.5em;
}

.emoji.selected {
    color: gold; /* Highlight selected rating */
}
```
