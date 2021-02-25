import React, { FC, useLayoutEffect, useRef } from 'react';

interface Props {
  messages: Array<FC>;
  className?: string;
}

export const MessageList: FC<Props> = ({ messages, className = '' }) => {
  const lastMessageRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    lastMessageRef.current!.scrollIntoView({ behavior: 'smooth' });
  }, [lastMessageRef, messages]);

  return (
    <ul className={`flex flex-col w-full p-2 ${className}`}>
      { messages.map((Message, index) => (
        <li key={index}>
          <Message />
        </li>
      )) }
      <li ref={lastMessageRef}/>
    </ul>
  )
};
