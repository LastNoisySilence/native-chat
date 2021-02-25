import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';
import produce from 'immer';

import { InfoMessage } from '../components/InfoMessage';
import { UserMessage } from '../components/UserMessage';

import { getRandomColor } from '../utils/getRandomColor';

enum ActionTypes {
  ADD_USER = 'add user',
  LOGIN = 'login',
  USER_JOINED = 'user joined',
  USER_LEFT = 'user left',
  TYPING = 'typing',
  STOP_TYPING = 'stop typing',
  NEW_MESSAGE = 'new message'
}

type UserNamePayload = { username: string; };
type UserCountPayload = { numUsers: string; };
type MessagePayload = { message: string; };

type ActionPayload = string
  | UserNamePayload
  | UserCountPayload
  | UserNamePayload & MessagePayload
  | UserNamePayload & UserCountPayload;

type Action = { type: ActionTypes; payload?: ActionPayload };

const createAction = ({ type, payload }: Action) => {
  return `42${JSON.stringify([type, payload])}`;
};

const readAction = (data: string) => {
  const [, action] = data.split('42');
  return action && JSON.parse(action);
};

interface InitialState {
  colors: { [key: string]: string };
  typings: { [key: string]: FC; };
  messages: Array<FC>;
}

const initialState: InitialState = {
  colors: {},
  typings: {},
  messages: []
};

const reducer = (state: InitialState, { type, payload }: Action) => {
  switch (type) {
    case ActionTypes.LOGIN: {
      const { numUsers } = payload as UserCountPayload;

      return produce(state, draft => {
        draft.messages.push(() => <InfoMessage text={ `Welcome to Very Native Socket Chat` }/>);
        draft.messages.push(() => <InfoMessage text={ `there are ${numUsers} participants` }/>);

        return draft;
      });
    }
    case ActionTypes.USER_JOINED:
    case ActionTypes.USER_LEFT: {
      return produce(state, draft => {
        const { username, numUsers } = payload as UserNamePayload & UserCountPayload;

        draft.messages.push(() => <InfoMessage text={ `${username} ${type === ActionTypes.USER_JOINED ? 'joined' : 'left'}` }/>);
        draft.messages.push(() => <InfoMessage text={ `there are ${numUsers} participants` }/>);

        return draft
      });
    }
    case ActionTypes.TYPING:
    case ActionTypes.NEW_MESSAGE: {
      const { username, message } = payload as UserNamePayload & MessagePayload;

      return produce(state, draft => {
        let nicknameColor = state.colors[username];

        if (!nicknameColor) {
          draft.colors[username] = nicknameColor = getRandomColor();
        }

        if (type === ActionTypes.NEW_MESSAGE) {
          draft.messages.push(() => <UserMessage nickname={username} message={message} nicknameColor={ nicknameColor }/>);
        } else {
          const Component = () => <UserMessage nickname={username} nicknameColor={ nicknameColor } isTyping/>;

          draft.typings[username] = Component;
          draft.messages.push(Component);
        }

        return draft;
      })
    }
    case ActionTypes.STOP_TYPING: {
      const { username } = payload as UserNamePayload;

      return produce(state, draft => {
        draft.messages = state.messages.filter(filter => filter !== state.typings[username]);

        return draft;
      })
    }
    default: return state;
  }
};

type UseChat = (
  nickname: string,
  address: string
) => {
  state: InitialState;
  handleCreateMessage: (message: string) => void;
  handleTyping: (isTyping: boolean) => void;
};

export const useChat: UseChat = (nickname: string, address: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (nickname) {
      const ws = new WebSocket(address);

      setSocket(ws);

      ws.onopen = () => {
        ws.send(createAction({ type: ActionTypes.ADD_USER, payload: nickname }));
      };

      ws.onmessage = ({ data }) => {
        const action = readAction(data);

        if (action) {
          const [type, payload] = action;

          dispatch({ type, payload });
        }
      };

      const interval = setInterval(
        () => ws.send('2'),
        20 * 1000
      );

      return () => {
        ws.close(1000);
        clearInterval(interval);
      };
    }
  }, [nickname, address]);

  const handleCreateMessage = useCallback((message: string) => {
    socket?.send(
      createAction({
        type: ActionTypes.NEW_MESSAGE,
        payload: message
      })
    );
    dispatch({
      type: ActionTypes.NEW_MESSAGE,
      payload: { message, username: nickname }
    });
  }, [socket, nickname]);

  const handleTyping = useCallback(
    (isTyping: boolean) => socket?.send(
      createAction({
        type: isTyping
          ? ActionTypes.TYPING
          : ActionTypes.STOP_TYPING,
        payload: { username: nickname }
      })
    ),
    [socket, nickname]
  );

  return { state, handleCreateMessage, handleTyping };
};
