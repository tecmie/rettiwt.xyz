import { useForm } from '@/components/forms';
import { FormRadioCard } from '@/components/forms';
import SeoMeta from '@/components/seo-meta';
import { SplitShell } from '@/layout/split-shell';
import {
  Text,
  Flex,
  Button,
  Stack,
  Container,
  Heading,
  Center,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { z } from 'zod';

const selectPersona = [
  {
    name: 'Andrew Miracule',
    value: '0xalzzy',
    metadata: {
      id: 0,
      bio: 'A witty young man',
    },
  },
  {
    name: 'John Doe',
    value: 'johndoe',
    metadata: {
      id: 1,
      bio: 'A mysterious stranger',
    },
  },
  {
    name: 'Jane Smith',
    value: 'janesmith',
    metadata: {
      id: 2,
      bio: 'A brilliant scientist',
    },
  },
  {
    name: 'Bob Johnson',
    value: 'bobjohnson',
    metadata: {
      id: 3,
      bio: 'A friendly neighbor',
    },
  },
  {
    name: 'Alice Lee',
    value: 'alicelee',
    metadata: {
      id: 4,
      bio: 'A talented artist',
    },
  },
  {
    name: 'David Kim',
    value: 'davidkim',
    metadata: {
      id: 5,
      bio: 'A passionate musician',
    },
  },
];
const personaFormSchema = z.object({
  personaProfile: z.string().nonempty(),
  // occupation: z.string().nonempty(),
  // phone: z.string().nonempty(),
});

export default function RouterPage() {
  const router = useRouter();

  const handleOnSubmit = async (data: z.infer<typeof personaFormSchema>) => {
    alert(JSON.stringify(data));

    await router.push('/home');
  };

  const { renderForm } = useForm<z.infer<typeof personaFormSchema>>({
    onSubmit: handleOnSubmit,
    mode: 'onBlur',
    schema: personaFormSchema,
    defaultValues: {
      personaProfile: '@0xalzzy',
    },
  });
  return renderForm(
    <Fragment>
      <SeoMeta />

      <Container w={'full'} minW={'xl'}>
        <Stack spacing={0} py={6} pt={12}>
          <Heading as={'h1'} size={'md'}>
            Welcome
          </Heading>
          <Text>
            To begin exploring this simulation, select a persona you would like
            to act as
          </Text>
        </Stack>

        <FormRadioCard
          label="Click on a profile to begin"
          name={'personaProfile'}
          options={selectPersona}
        />
      </Container>

      <Flex
        justify={'center'}
        borderTopWidth={'2px'}
        w={'full'}
        right={0}
        position="absolute"
        bottom={0}
        h={16}
        bg={'bg-surface'}
      >
        <Center minW={'200px'}>
          <Button w={'full'} variant={'solid'} type="submit" colorScheme="blue">
            Continue
          </Button>
        </Center>
      </Flex>
    </Fragment>,
  );
}

RouterPage.getLayout = (page: React.ReactNode) => (
  <SplitShell
    navFlexProps={{
      display: 'none',
    }}
  >
    {page}
  </SplitShell>
);
