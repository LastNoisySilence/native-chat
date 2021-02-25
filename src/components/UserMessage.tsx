import React, { FC } from 'react';

interface Props {
  nickname: string;
  message?: string;
  isTyping?: boolean;
  nicknameColor: string;
}

export const UserMessage: FC<Props> = ({ nickname, isTyping, message, nicknameColor }) => {
  return (isTyping || !!message) ? (
    <div className=''>
      <span className='font-bold text-xl mr-2' style={{ color: nicknameColor }}>{nickname}:</span>
      { isTyping ? (
        <span>is typing...</span>
      ) : (
        <span className='break-words'>{message}</span>
      ) }
    </div>
  ) : null;
};
