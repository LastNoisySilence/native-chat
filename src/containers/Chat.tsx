import React, { FC, useState } from 'react';

import { NicknameScreen } from '../components/NicknameScreen';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';

import { useChat } from '../hooks/useChat';

export const Chat: FC = () => {
  const [nickName, setNickName] = useState('');
  const { state: { messages }, handleCreateMessage, handleTyping } = useChat(
    nickName,
    'wss://socketio-chat-h9jt.herokuapp.com/socket.io/?EIO=3&transport=websocket'
  );

  if (!nickName) {
    return <NicknameScreen onEnter={setNickName} />;
  }

  return (
    <main className='h-screen w-full flex flex-col'>
      <MessageList
        messages={messages}
        className='h-full overflow-auto'
      />
      <MessageInput
        onEnter={handleCreateMessage}
        onTyping={handleTyping}
        className='p-2 bg-gray-900'
      />
    </main>
  )
};
