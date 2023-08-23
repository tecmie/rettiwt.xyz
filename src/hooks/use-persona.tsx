import * as React from 'react';
import { createContext } from '@chakra-ui/react-utils';
import { useLocalStorage } from 'usehooks-ts';
import { parseCookies } from 'nookies';
import { api } from '@/utils/api';

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
  /* Instead of path params, lets use cookies */
  const cookies = parseCookies();
  console.log(`${{ cookies }} from ... [use-persona]`);

  const profilePersona = cookies['persona'];

  /* Call trpc API to retrieve author profile */
  const { data: authorProfile } = api.author.getAuthorProfile.useQuery();

  const [activeProfilePersona, setProfilePersona] = useLocalStorage(
    __STORAGE_KEY__,
    profilePersona,
  );

  React.useEffect(() => {
    if (profilePersona && profilePersona !== activeProfilePersona) {
      setProfilePersona(profilePersona);
    }
  }, [cookies]);

  const setNewProfilePersona = (newProfilePersona: string) => {
    setProfilePersona(newProfilePersona);
  };

  return { activeProfilePersona, setNewProfilePersona };
};
