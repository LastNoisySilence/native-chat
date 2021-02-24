import React, { FC, useState } from 'react';

import { NicknameScreen } from '../components/NicknameScreen';
import { useChat } from '../hooks/useChat';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';

export const Chat: FC = () => {
  const [nickName, setNickName] = useState('');
  const { state: messages, handleCreateMessage } = useChat(nickName, 'wss://socketio-chat-h9jt.herokuapp.com/socket.io/?EIO=3&transport=websocket');

  if (!nickName) {
    return <NicknameScreen onEnter={setNickName} />;
  }

  return (
    <main className='h-screen w-full flex flex-col'>
      <MessageList messages={messages} className='h-full'/>
      <MessageInput onEnter={handleCreateMessage} className='p-2 bg-gray-900'/>
    </main>

  )
};
