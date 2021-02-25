import React, { FC, useCallback, useLayoutEffect, useRef } from 'react';

import { useInput } from '../hooks/useInput';

interface Props {
  className?: string;
  onEnter: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export const MessageInput: FC<Props> = ({ onEnter, onTyping, className = '' }) => {
  const { value: message, handleChange, handleEnterDown } = useInput(onEnter);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typing = useRef({ lastTyping: 0, isTyping: false });

  useLayoutEffect(
    () => messageInputRef.current?.focus(),
    [messageInputRef]
  );

  const handleInput = useCallback(() => {
    typing.current.lastTyping = (new Date()).getTime();

    if (!typing.current.isTyping) {
      typing.current.isTyping = true;
      onTyping(true);
    }

    setTimeout(() => {
      const typingTimer = (new Date()).getTime();

      if (typingTimer - typing.current.lastTyping >= 400 && typing.current.isTyping) {
        typing.current.isTyping = false;
        onTyping(false);
      }
    }, 400);
  }, [onTyping]);

  return (
    <footer className={`flex w-full h-12 ${className}`}>
      <input
        type='text'
        ref={messageInputRef}
        className='w-full h-full focus:outline-none p-2'
        onChange={handleChange}
        onKeyDown={handleEnterDown}
        onInput={handleInput}
        value={message}
        placeholder='Type here...'
      />
    </footer>
  )
};
