import { z } from 'zod';
import { Fragment } from 'react';
import { AuthorRadioCard } from '@/components/forms';
import { useProfilePersona } from '@/hooks/use-persona';
import { api } from '@/utils/api';
import {
  type useDisclosure,
  Button,
  Dialog,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from '@/components/forms';
import { BsArrowRightCircle } from 'react-icons/bs';

type PersonaModalProps = {
  disclosure: ReturnType<typeof useDisclosure>;
};

const personaFormSchema = z.object({
  personaProfile: z.string().nonempty(),
});

export function PersonaModal({ disclosure }: PersonaModalProps) {
  const router = useRouter();

  const { isOpen, onClose } = disclosure;
  const { setNewProfilePersona } = useProfilePersona();

  const handleOnSubmit = (data: z.infer<typeof personaFormSchema>) => {
    const author = JSON.parse(data.personaProfile);

    setNewProfilePersona(author);
    onClose();

    // window && window.location.reload();
    void router.push('/home');
  };

  const {
    renderForm,
    formState: { isDirty },
  } = useForm<z.infer<typeof personaFormSchema>>({
    onSubmit: handleOnSubmit,
    schema: personaFormSchema,
    defaultValues: {
      personaProfile: '@0xalzzy',
    },
  });

  return (
    <Dialog.Root
      size={'sm'}
      onOpenChange={(details) => !details.open && onClose()}
      open={isOpen}
      placement="center"
    >
      <Dialog.Backdrop
        bg="blackAlpha.300"
        backdropFilter="blur(1px) hue-rotate(10deg)"
      />
      {renderForm(
        <Dialog.Content rounded={'2xl'} bg={'bg-surface'} w={'full'}>
          <Dialog.Header>
            <Dialog.Title>Switch Profiles</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <SelectPersonaForm />
          </Dialog.Body>
          <Dialog.Footer mb={2}>
            <Button
              size={'lg'}
              rightIcon={<BsArrowRightCircle />}
              disabled={!isDirty}
              w={'full'}
              type="submit"
              colorScheme="blue"
            >
              Continue with Persona
            </Button>
          </Dialog.Footer>
        </Dialog.Content>,
      )}
    </Dialog.Root>
  );
}

function SelectPersonaForm() {
  const { data: personaList } = api.author.list_form_modal.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return (
    <Fragment>
      {personaList && (
        <AuthorRadioCard
          withName={false}
          label="Select a new profile to act as, if a profile is not available, refresh the page."
          name={'personaProfile'}
          options={personaList}
        />
      )}
    </Fragment>
  );
}
