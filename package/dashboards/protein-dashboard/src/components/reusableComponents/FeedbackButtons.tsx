import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitFeedback } from 'api/api';

interface FeedbackButtonsProps {
  queryId: string;
  response: string;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ queryId, response }) => {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);


  const handleFeedback = async (isPositive: boolean) => {
    //we don't need to do anything if feedback is negative
    if (queryId === 'initial' || queryId === undefined) {
        setSubmitted(true);
        return;
      }
    setFeedback(isPositive);
    setSubmitted(true);
    const payload = { queryId, response, isPositive };
    console.log("Submitting feedback with payload:", payload);
    await submitFeedback({ queryId, response, isPositive });

    if (queryId === 'initial') {
        return null;
      }
  };

    return (
    <div className="feedback-container">
      <Button
        onClick={() => handleFeedback(true)}
        className={`feedback-button ${feedback === true ? 'highlighted' : ''}`}
        disabled={submitted}
      >
        👍
      </Button>
      <Button
        onClick={() => handleFeedback(false)}
        className={`feedback-button ${feedback === false ? 'highlighted' : ''}`}
        disabled={submitted}
      >
        👎
      </Button>
      {feedback !== null && <div className="feedback-message">Thank you for your feedback!</div>}
    </div>
  );
};

export default FeedbackButtons;