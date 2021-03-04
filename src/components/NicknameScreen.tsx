import React, { FC, useCallback, useLayoutEffect, useRef } from 'react';

import { useInput } from '../hooks/useInput';

interface Props {
  onEnter: (nick: string) => void;
}

export const NicknameScreen: FC<Props> = ({ onEnter }) => {
  const nickNameInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    nickNameInputRef.current?.focus();
  }, []);

  const handleNicknameInputFocus = useCallback(
    () => nickNameInputRef.current?.focus(),
    []
  );

  const { value: nickname, handleChange, handleEnterDown, handleSetValue } = useInput(onEnter);

  return (
    <div
      className='h-screen bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex justify-center items-center'
      onClick={handleNicknameInputFocus}
    >
      <div>
        <h4 className='text-white text-center mb-2'>What's your nickname?</h4>
        <input
          type='text'
          ref={nickNameInputRef}
          className='text-center w-full mb-2 text-lg focus:outline-none'
          value={nickname}
          onChange={handleChange}
          onKeyDown={handleEnterDown}
        />
        <button
          className='from-gray-200 w-full bg-white px-2'
          onClick={handleSetValue}>
          Join
        </button>
      </div>
    </div>
  )
};
