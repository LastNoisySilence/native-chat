import { useCallback, useState } from 'react';

export const useInput = (onEnter: (value: string) => void) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    ({ target: { value } }) => setValue(value),
    []
  );

  const handleEnterDown = useCallback(({ key }) => {
    if (key === 'Enter') {
      if ((value || '').trim()) {
        onEnter(value);
        setValue('');
      }
    }
  }, [onEnter, value]);

  return { value, handleChange, handleEnterDown };
};
