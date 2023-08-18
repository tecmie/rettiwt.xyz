import * as React from 'react'
import { createContext } from '@chakra-ui/react-utils'
import { useLocalStorage } from 'usehooks-ts'

export type Author = string
export const __STORAGE_KEY__ = 'xims.persona'

export interface Persona {
  setAuthor: (author: Author) => Author
}

export interface PersonaContextValue {
  author?: Author | null
  setAuthor: (Author: Author) => void
}

export const [PersonaContextProvider, usePersona] =
  createContext<PersonaContextValue>({
    name: 'PersonaProvider',
  })

interface PersonaProviderProps {
  author?: Author | null
  onChange?: (author: string) => void
  children: React.ReactNode
}


export function PersonaProvider(props: PersonaProviderProps) {
  const {
    children,
    author,
    onChange,
  } = props

  const [_persona, setPersona] = useLocalStorage(__STORAGE_KEY__, author)

  React.useEffect(() => {
    if (author && author !== _persona) {
      setPersona(author)
    }
  }, [author])

  const context = React.useMemo(
    () => ({
      author: _persona,
      setAuthor: (author: Author) => {
        setPersona(author)
        onChange?.(author)
      },
    }),
    [author, onChange],
  )

  return (
    <PersonaContextProvider value={context}>
    {children}
    </PersonaContextProvider>
  )
}


export const userPersona = () => {
  const context = usePersona()
  return context.author
}
