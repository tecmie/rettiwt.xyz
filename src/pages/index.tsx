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

  const handleOnSubmit = async (data: z.infer<typeof personaFormSchema>) => {
    try {
      // Comment out JSON.parse - the data might already be an object
      // const author = JSON.parse(data.personaProfile);
      const author = data.personaProfile;

      console.log({ usePersonaActor: author, rawData: data.personaProfile });

      // If author is a string (JSON), parse it; otherwise use as-is
      const authorObj = typeof author === 'string' ? JSON.parse(author) : author;

      // Ensure the author object has the expected structure
      if (authorObj && (authorObj.handle || authorObj.value)) {
        const personaData = {
          ...authorObj,
          handle: authorObj.handle || authorObj.value, // Use handle if available, otherwise use value
        };

        setNewProfilePersona(personaData);
        await router.push('/home');
      } else {
        console.error('Invalid persona data:', authorObj);
        alert('Please select a valid persona');
      }
    } catch (error) {
      console.error('Error processing persona data:', error);
      alert('Error processing selection. Please try again.');
    }
  };

  const { renderForm, formState, watchForm } = useForm<z.infer<typeof personaFormSchema>>({
    onSubmit: handleOnSubmit,
    schema: personaFormSchema,
    defaultValues: {
      personaProfile: '',
    },
  });

  // Watch the personaProfile field to enable/disable the button
  const selectedPersona = watchForm('personaProfile');
  
  // Check if form is valid (has a selected persona)
  const isFormValid = selectedPersona && selectedPersona.trim() !== '';

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
            disabled={!isFormValid || formState.isSubmitting}
            loading={formState.isSubmitting}
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
