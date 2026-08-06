import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = (props) => {
  const style: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    minHeight: '100px',
    resize: 'vertical',
  };

  return <textarea style={style} {...props} />;
};

export default Textarea;

