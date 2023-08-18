import * as React from 'react';
import { createContext } from '@chakra-ui/react-utils';
import { useLocalStorage } from 'usehooks-ts';
import { useRouter } from 'next/router';

export type Author = string;
export const __STORAGE_KEY__ = 'xims.persona';

export interface Persona {
  setAuthor: (author: Author) => Author;
}

export interface PersonaContextValue {
  author?: Author | null;
  setAuthor: (Author: Author) => void;
}

export const [PersonaContextProvider, usePersona] =
  createContext<PersonaContextValue>({
    name: 'PersonaProvider',
  });

/**
 * Get the current profile persona from localStorage if available.
 * The value is synced with the query params.
 *
 * @returns {string} The current profile persona
 */
export const useProfilePersona = () => {
  const { query, pathname } = useRouter();
  console.log(`${{ pathname, query }} from ... [use-persona]`);

  const params = query;
  const profilePersona = params.persona?.toString() || '';

  const [activeProfilePersona, setProfilePersona] = useLocalStorage(
    __STORAGE_KEY__,
    profilePersona,
  );

  React.useEffect(() => {
    if (profilePersona && profilePersona !== activeProfilePersona) {
      setProfilePersona(profilePersona);
    }
  }, [params]);

  const setNewProfilePersona = (newProfilePersona: string) => {
    setProfilePersona(newProfilePersona);
  };

  return { activeProfilePersona, setNewProfilePersona };
};
