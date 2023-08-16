import {
  Link,
  Stack,
  StackProps,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { api } from "@/utils/api";
import { useState } from "react";

export const TimelineView = (props: StackProps) => {
  const [currCursor, setCurrCursor] = useState(0);
  const tweets = api.timeline.list.useInfiniteQuery(
    {
      id: "1",
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: currCursor, // <-- optional you can pass an initialCursor
    }
  );

  console.log(tweets.data?.pages[0]);

  return (
    <Stack
      spacing={{ base: "1px", lg: "1" }}
      px={{ lg: "3" }}
      py="3"
      {...props}
    >
      {tweets.data?.pages[currCursor]?.tweets.map((post) => (
        <Link
          key={post.id}
          aria-current={post.id === "2" ? "page" : undefined}
          _hover={{ textDecoration: "none", bg: mode("gray.100", "gray.700") }}
          _activeLink={{ bg: "gray.700", color: "white" }}
          borderRadius={{ lg: "lg" }}
        >
          <Stack
            spacing="1"
            py={{ base: "3", lg: "2" }}
            px={{ base: "3.5", lg: "3" }}
            fontSize="sm"
            lineHeight="1.25rem"
          >
            <Text fontWeight="medium">{post.author.handle}</Text>
            <Text opacity={0.8}>{post.content}</Text>
            <Text opacity={0.6}>{post.timestamp as string}</Text>
          </Stack>
        </Link>
      ))}
    </Stack>
  );
};
