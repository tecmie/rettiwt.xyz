import {
  ButtonGroup,
  Container,
  IconButton,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Logo } from "./navbar-logo";

export const Footer = () => (
  <Container as="footer" role="contentinfo" py={{ base: "12", md: "16" }}>
    <Stack spacing={{ base: "4", md: "5" }}>
      <Stack justify="space-between" direction="row" align="center">
        <Logo />

        <VStack align={"flex-end"}>
          <ButtonGroup variant="tertiary">
            <IconButton
              as="a"
              href="#"
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="GitHub"
              icon={<FaGithub />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Twitter"
              icon={<FaTwitter />}
            />
          </ButtonGroup>

          <Link href="#" aria-label="Privacy Policy">
            Privacy Policy
          </Link>
          <Link href="#" aria-label="Terms of Service">
            Terms of Service
          </Link>
          <Link href="#" aria-label="Contact Us">
            Contact Us
          </Link>
        </VStack>
      </Stack>
      <Text fontSize="sm" color="fg.subtle">
        &copy; {new Date().getFullYear()} Epic Brand School. All rights
        reserved.
      </Text>
    </Stack>
  </Container>
);
