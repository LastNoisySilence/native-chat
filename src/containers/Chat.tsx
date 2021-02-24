import React, { FC, useState } from 'react';

import { NicknameScreen } from '../components/NicknameScreen';
import { useChat } from '../hooks/useChat';

export const Chat: FC = () => {
  const [nickName, setNickName] = useState('');
  const { state } = useChat(nickName, 'wss://socketio-chat-h9jt.herokuapp.com/socket.io/?EIO=3&transport=websocket');

  console.log(state);

  if (!nickName) {
    return <NicknameScreen onEnter={setNickName} />;
  }

  return <h1>Chat</h1>
};
