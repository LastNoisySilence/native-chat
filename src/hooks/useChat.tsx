import React, { FC, useCallback, useEffect, useReducer, useState } from 'react';
import produce from 'immer';
import { InfoMessage } from '../components/InfoMessage';

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

const initialState: Array<FC> = [];

const reducer = (state: Array<FC>, { type, payload }: Action) => {
  switch (type) {
    case ActionTypes.USER_JOINED:
    case ActionTypes.USER_LEFT: {
      return produce(state, draft => {
        const { username, numUsers } = payload as UserNamePayload & UserCountPayload;

        draft.push(() => <InfoMessage text={ `${username} ${type === ActionTypes.USER_JOINED ? 'joined' : 'left'}` }/>);
        draft.push(() => <InfoMessage text={ `there are ${numUsers} participants` }/>);
        return draft
      });
    }
    default: return state;
  }
};

type UseChatParams = (
  nickname: string,
  address: string,
  options?: {
    onMessage?: (event: Event) => void;
    onOpen?: (event: Event) => void;
  }
) => {
  state: typeof initialState;
  socket: WebSocket | null;
  handleCreateMessage: (message: string) => void;
};

export const useChat: UseChatParams = (nickname: string, address: string, { onMessage, onOpen } = {}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleMessage = useCallback((event) => {
    const action = readAction(event.data);
    onMessage?.(event);

    if (action) {
      const [type, payload] = action;

      dispatch({ type, payload });
    }
  }, [onMessage, dispatch]);

  useEffect(() => {
    if (nickname) {
      const ws = new WebSocket(address);

      setSocket(ws);

      ws.onopen = event => {
        onOpen?.(event);
        ws.send(createAction({ type: ActionTypes.ADD_USER, payload: nickname }));
        dispatch({ type: ActionTypes.LOGIN });
      };

      ws.onmessage = handleMessage;

      const interval = setInterval(
        () => ws.send('2'),
        20 * 1000
      );

      return () => {
        ws.close(1000);
        clearInterval(interval);
      };
    }
  }, [nickname, address, handleMessage, onOpen]);

  const handleCreateMessage = useCallback((message: string) => {
    socket?.send(
      createAction({
        type: ActionTypes.NEW_MESSAGE,
        payload: message
      })
    );
  }, [socket]);

  return { state, socket, handleCreateMessage };
};
