import {
    HTMLChakraProps,
    chakra,
  } from "@chakra-ui/react";
  import * as React from "react";
  
  export function CommentIcon(props: HTMLChakraProps<"svg">) {
  return (
    <chakra.svg
      viewBox="0 0 24 24"
      w={4}
      fill="muted"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366a8.13 8.13 0 018.129 8.13c0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067A8.005 8.005 0 011.751 10zm8.005-6a6.005 6.005 0 10.133 12.01l.351-.01h1.761v2.3l5.087-2.81A6.127 6.127 0 0014.122 4H9.756z" />
    </chakra.svg>
  )
}