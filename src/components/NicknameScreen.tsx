import React, { FC, useCallback, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  onEnter: (nick: string) => void;
}

export const NicknameScreen: FC<Props> = ({ onEnter }) => {
  const nickNameInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState('');

  useLayoutEffect(() => {
    nickNameInputRef.current!.focus();
  }, [nickNameInputRef]);

  const handleNicknameChange = useCallback(
    ({ target: { value } }) => setNickname(value),
    []
  );

  const handleEnterDown = useCallback(({ key }) => {
    if (key === 'Enter') {
      onEnter(nickname);
    }
  }, [onEnter, nickname]);

  const handleNicknameInputFocus = useCallback(
    () => nickNameInputRef.current!.focus(),
    [nickNameInputRef]
  );

  return (
    <div
      className='h-screen bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex justify-center items-center'
      onClick={handleNicknameInputFocus}
    >
      <div>
        <h4 className='text-white mb-2'>What's your nickname?</h4>
        <input
          type='text'
          ref={nickNameInputRef}
          className='text-center text-lg focus:outline-none'
          value={nickname}
          onChange={handleNicknameChange}
          onKeyDown={handleEnterDown}
        />
      </div>
    </div>
  )
};
