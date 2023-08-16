import React, { Fragment } from 'react';
import {
  Container,
  Heading,
  Box,
  Text,
  Button,
  chakra,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Navbar } from '@/components/navbar';
import SeoMeta from '@/components/seo-meta';
import { FormEditableInput, useForm } from '@/components/forms';
import { z } from 'zod';

const setupValidationSchema = z.object({
  fullName: z.string().nonempty(),
  occupation: z.string().nonempty(),
  location: z.string().nonempty(),
  email: z.string().email(),
  website: z.string().nonempty(),
  phone: z.string().nonempty(),
});

export default function Page() {
  const { renderForm } = useForm<z.infer<typeof setupValidationSchema>>({
    onSubmit: (data) => console.log(data),
    schema: setupValidationSchema,
    defaultValues: {
      fullName: 'Seun Andrew',
      occupation: 'Brand Designer',
      location: 'Lagos, Nigeria',
      website: 'seun.design',
      email: '',
      phone: '',
    },
  });

  return renderForm(
    <Fragment>
      <SeoMeta />

      <Navbar />
      <Stack>
        <Container py={{ base: '12', md: '16' }} height="full">
          <Box>
            <Heading as="h3" size="sm" color={'gray.800'} fontWeight="bold">
              Let&apos;s get you started —
            </Heading>

            {/* Tell us a bit more about yourself.  */}
            <Text fontSize={{ base: 'lg', md: '2xl' }} mb={10} mt={2}>
              Update the sections that have been highlighted with your
              information.
            </Text>
          </Box>

          <Stack
            lineHeight={'24px'}
            color={'gray.300'}
            fontSize={{ base: 'lg', md: '3vmin' }}
          >
            <chakra.span>
              <chakra.span pr={1}>I&apos;m</chakra.span>
              <FormEditableInput
                label="Seun Badejo"
                name="fullName"
                textSize={useBreakpointValue({ base: '106px', lg: '8.5vw' })}
              />
              <chakra.span px={1}>I&apos;m currently a</chakra.span>
              <FormEditableInput
                label="Brand Designer"
                name="occupation"
                textSize={useBreakpointValue({ base: '116px', lg: '10.5vw' })}
              />
              <chakra.span px={1}>and I live in</chakra.span>
              <FormEditableInput
                label="Lagos, Nigeria"
                name="location"
                textSize={useBreakpointValue({ base: '112px', lg: '9.5vw' })}
              />

              <chakra.span px={1}>
                You can check out some of my work on my website at{' '}
              </chakra.span>
              <FormEditableInput
                label="www.seun.design"
                name="website"
                textSize={useBreakpointValue({ base: '120px', lg: '11.5vw' })}
              />
              <chakra.span px={1}>
                The best way to reach me is through my email,{' '}
              </chakra.span>
              <FormEditableInput
                label="the.53vn@gmail.com"
                name="email"
                textSize={useBreakpointValue({ base: '160px', lg: '13.5vw' })}
              />
              <chakra.span px={1}>or my phone, </chakra.span>
              <FormEditableInput
                label="+1 123 456 7890"
                name="phone"
                textSize={useBreakpointValue({ base: '132px', lg: '10.5vw' })}
              />
            </chakra.span>
            <Button my={8} variant={'outline'} w={'max-content'} type="submit">
              Get Started
            </Button>
          </Stack>
        </Container>
      </Stack>
    </Fragment>,
  );
}
