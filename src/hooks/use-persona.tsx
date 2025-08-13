/* eslint-disable */
import * as React from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { parseCookies, setCookie } from 'nookies';
import { api } from '@/utils/api';

type Author = string;
export const __STORAGE_KEY__ = 'xims.persona';

/**
 * Get the current profile persona from localStorage if available.
 * The value is synced with the query params.
 *
 * @returns {Object} The current profile persona
 */
export const useProfilePersona = () => {
  // Read the persona handle from cookies
  const cookies = parseCookies();
  const personaHandle = cookies['persona'];

  // Use the persona handle to fetch the author profile from our API
  const authorQuery = api.author.get.useQuery({
    handle: personaHandle as Author,
  });

  // If the author data changes, update the local storage
  const [activeProfilePersona, setProfilePersona] = useLocalStorage(
    __STORAGE_KEY__,
    authorQuery.data,
  );

  React.useEffect(() => {
    if (personaHandle && personaHandle !== activeProfilePersona?.handle) {
      authorQuery.refetch();
      setProfilePersona(authorQuery.data);
    }
  }, [personaHandle, authorQuery.status, authorQuery.data]);

  // @ts-ignore
  const setNewProfilePersona = (newProfilePersona) => {
    const handle = newProfilePersona.handle || newProfilePersona.value;
    
    if (!handle) {
      console.error('No handle found in persona data:', newProfilePersona);
      return;
    }

    console.log('Setting persona cookie with handle:', handle);

    // Set a cookie to store the profile information
    setCookie(null, 'persona', handle, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    /* We automatically signIn the User pre-API request */
    //  signIn("credentials", {
    //   username: newProfilePersona.handle,
    //   name: newProfilePersona.name,
    //   redirect: false,
    //   callbackUrl: undefined,
    // });

    setProfilePersona(newProfilePersona);
  };

  return {
    handle: personaHandle,
    name: activeProfilePersona?.name,
    activeProfilePersona: authorQuery.data,
    setNewProfilePersona,
  };
};
