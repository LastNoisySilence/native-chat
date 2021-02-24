import React, { FC } from 'react';

interface Props {
  text: string;
}

export const InfoMessage: FC<Props> = ({ text }) => (
  <p className='text-gray-400'>{text}</p>
);
