import { HTMLChakraProps, chakra, useColorModeValue as mode } from "@chakra-ui/react"
import * as React from "react"

export function XLogo(props: HTMLChakraProps<"svg">){
  return (
    <chakra.svg
      viewBox="0 0 24 24"
      width={6}
      fill={mode('gray.800', 'white')}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </chakra.svg>
  )
}

export default XLogo
