import React, { FC } from 'react';

interface Props {
  messages: Array<FC>;
}

export const MessageList: FC<Props> = ({ messages }) => {
  return (
    <ul>
      { messages.map((Message, index) => (
        <li key={index}>
          <Message />
        </li>
      )) }
    </ul>
  )
};
