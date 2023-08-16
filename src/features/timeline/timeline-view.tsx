import {
  Avatar,
  Box,
  HStack,
  Link,
  Stack,
  IconButton,
  StackDivider,
  StackProps,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { api } from "@/utils/api";
import { useState } from "react";
import { format } from "timeago.js";
import { FiArrowLeft, FiShare } from "react-icons/fi";
import { ColumnIconButton } from "@/layout/split-shell/Column";
import { FaComment, FaRegComment, FaRetweet } from "react-icons/fa";
import { MdComment, MdInsertComment, MdModeComment, MdOutlineAddComment, MdOutlineComment } from "react-icons/md";
import { AiOutlineComment, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { CommentIcon, ImpressionIcon, RetweetIcon, ShareIcon } from "@/components/icons";

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
      py="3"
      divider={<StackDivider />}
      {...props}
    >
      {tweets.data?.pages[currCursor]?.tweets.map((post) => (
        <HStack align="start" px={4} py={2}>
          <Box w={'40px'}>

                      <Avatar src={post.author.avatar} boxSize="9">
                  {/* <AvatarBadge boxSize="4" bg={post.is_pinned ? 'success' : 'subtle'} /> */}
                </Avatar>
          </Box>

        <Link
          key={post.id}
          aria-current={post.id === "2" ? "page" : undefined}
          _hover={{ 
            textDecoration: "none", 
            // bg: mode("blackAlpha.50", "whiteAlpha.50")
           }}
          w={'full'}
          // _activeLink={{ bg: "gray.700", color: "white" }}
          borderRadius={{ lg: "lg" }}
        >
                        <HStack spacing="1">
    
                  <Text size="sm" fontWeight="bold" color="emphasized">
                    {post.author.name}
                  </Text>
                  <Text size="sm" opacity={0.6} color="muted">@{post.author.handle}</Text>
            <Text opacity={0.6} color={'muted'}> • {format(post.timestamp)}</Text>

              </HStack>
              
          <Stack
            spacing="1"
            py={{ base: "3", lg: "2" }}
            fontSize="sm"
            lineHeight="1.25rem"
          >
            <Text opacity={0.8}>{post.content}</Text>
          </Stack>

          <HStack justify={'space-between'}>
          <ColumnIconButton
              aria-label="Comment"
              rounded={'full'}
              color={'muted'}
              opacity={0.7}
              icon={<CommentIcon />}
            />

<ColumnIconButton
              aria-label="Retweet"
              rounded={'full'}
              color={'muted'}
              opacity={0.7}
              icon={<RetweetIcon />}
            />

<ColumnIconButton
              aria-label="Favorite"
              rounded={'full'}
              colorScheme="green"
              color={'muted'}
              opacity={0.7}
              icon={<AiOutlineHeart />}
            />
<ColumnIconButton
              aria-label="Favorite"
              rounded={'full'}
              colorScheme="green"
              color={'muted'}
              opacity={0.7}
              icon={<ImpressionIcon />}
            />

<ColumnIconButton
              aria-label="Share and Save"
              rounded={'full'}
              colorScheme="green"
              color={'muted'}
              opacity={0.7}
              icon={<ShareIcon />}
            />

          </HStack>

        </Link>
        </HStack>

      ))}
    </Stack>
  );
};
