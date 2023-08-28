import { useForm } from '@/components/forms';
import { AuthorRadioCard } from '@/components/forms';
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
  Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { z } from 'zod';
import { api } from '@/utils/api';
import { useProfilePersona } from '@/hooks/use-persona';

const personaFormSchema = z.object({
  personaProfile: z.string().nonempty(),
});

export default function RouterPage() {
  const router = useRouter();

  const { activeProfilePersona, setNewProfilePersona } = useProfilePersona();

  console.log({ activeProfilePersona, setNewProfilePersona });

  const handleOnSubmit = async (data: z.infer<typeof personaFormSchema>) => {
    const author = JSON.parse(data.personaProfile);

    setNewProfilePersona(author);

    console.log({ author });

    await router.push('/home');
  };

  const { renderForm } = useForm<z.infer<typeof personaFormSchema>>({
    onSubmit: handleOnSubmit,
    schema: personaFormSchema,
    defaultValues: {
      personaProfile: '@0xalzzy',
    },
  });

  /** @note It's important for us to call this query after the form hook */

  const { data: personaList, isLoading } = api.author.list_form.useQuery();

  if (!personaList || isLoading)
    return (
      <Center h={'100vh'}>
        <Spinner colorScheme="twitter" />
      </Center>
    );

  return renderForm(
    <Fragment>
      <SeoMeta />

      <Container minW={['sm', 'xl']} w={'full'} pb={[24, 24]}>
        <Stack spacing={0} py={6} pt={12}>
          <Heading as={'h1'} size={'md'}>
            Welcome
          </Heading>
          <Text>
            To begin exploring this simulation, select a persona you would like
            to act as
          </Text>
        </Stack>

        {personaList && (
          <AuthorRadioCard
            label="Click on a profile to begin"
            name={'personaProfile'}
            options={personaList as any}
          />
        )}
      </Container>

      <Flex
        justify={'center'}
        borderTopWidth={'2px'}
        w={'full'}
        right={0}
        position="fixed"
        bottom={0}
        h={16}
        bg={'bg-surface'}
      >
        <Center minW={'200px'}>
          <Button
            disabled
            w={'full'}
            variant={'solid'}
            type="submit"
            colorScheme="twitter"
          >
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
