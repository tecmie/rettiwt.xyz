import { type HTMLChakraProps, chakra } from '@chakra-ui/react';
import * as React from 'react';

export function ImpressionIcon(props: HTMLChakraProps<'svg'>) {
  return (
    <chakra.svg
      viewBox="0 0 24 24"
      w={4}
      fill="muted"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
    </chakra.svg>
  );
}
