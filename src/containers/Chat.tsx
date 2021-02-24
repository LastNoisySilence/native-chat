import React, { FC, useState } from 'react';

import { NicknameScreen } from '../components/NicknameScreen';

export const Chat: FC = () => {
  const [nickName, setNickName] = useState('');

  if (!nickName) {
    return <NicknameScreen onEnter={setNickName} />;
  }

  return <h1>Chat</h1>
};
