import React from 'react';

interface TextWrapperProps {
  text: string;
  maxLength: number;
}

const TextWrapper: React.FC<TextWrapperProps> = ({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

  return (
    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      <p>{displayText}</p>
      {text.length > maxLength && (
        <button onClick={handleToggle}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default TextWrapper;
