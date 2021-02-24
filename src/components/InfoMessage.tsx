import React, { FC } from 'react';

interface Props {
  text: string;
  className?: string;
}

export const InfoMessage: FC<Props> = ({ text, className = '' }) => (
  <p className={`text-gray-400 text-center ${className}`}>{text}</p>
);
