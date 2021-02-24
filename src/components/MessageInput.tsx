import React, { FC } from 'react';
import { useInput } from '../hooks/useInput';

interface Props {
  onEnter: (message: string) => void;
  className?: string;
}

export const MessageInput: FC<Props> = ({ onEnter, className = '' }) => {
  const { value: message, handleChange, handleEnterDown } = useInput(onEnter);

  return (
    <footer className={`flex w-full h-12 ${className}`}>
      <input
        type='text'
        className='w-full h-full focus:outline-none p-2'
        onChange={handleChange}
        value={message}
        placeholder='Type here...'
        onKeyDown={handleEnterDown}
      />
    </footer>
  )
};
