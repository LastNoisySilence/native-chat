import React, { FC } from 'react';

interface Props {
  messages: Array<FC>;
  className?: string;
}

export const MessageList: FC<Props> = ({ messages, className = '' }) => {
  return (
    <ul className={`flex flex-col w-full ${className}`}>
      { messages.map((Message, index) => (
        <li key={index}>
          <Message />
        </li>
      )) }
    </ul>
  )
};
