import { useCallback, useState } from 'react';

export const useInput = (onEnter: (value: string) => void) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    ({ target: { value } }) => setValue(value),
    []
  );

  const handleSetValue = useCallback(() => {
    if ((value || '').trim()) {
      onEnter(value);
      setValue('');
    }
  }, [onEnter, value]);

  const handleEnterDown = useCallback(({ key }) => {
    if (key === 'Enter') {
      handleSetValue();
    }
  }, [handleSetValue]);

  return { value, handleChange, handleEnterDown, handleSetValue };
};
