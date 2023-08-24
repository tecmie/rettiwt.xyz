import { z } from 'zod';
import { Fragment } from 'react';
import { AuthorRadioCard } from '@/components/forms';
import { useProfilePersona } from '@/hooks/use-persona';
import { api } from '@/utils/api';
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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

  const handleOnSubmit = async (data: z.infer<typeof personaFormSchema>) => {
    const author = JSON.parse(data.personaProfile);

    await setNewProfilePersona(author);

    console.log({ author });
    onClose();

    await router.push('/home');
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
    <Modal
      size={'sm'}
      // scrollBehavior="inside"
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(1px) hue-rotate(10deg)"
      />
      {renderForm(
        <ModalContent rounded={'2xl'} bg={'bg-surface'} w={'full'}>
          <ModalHeader>Switch Profiles</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectPersonaForm />
          </ModalBody>
          <ModalFooter mb={2}>
            <Button
              size={'lg'}
              rightIcon={<BsArrowRightCircle />}
              isDisabled={!isDirty}
              w={'full'}
              type="submit"
              colorScheme="blue"
            >
              Continue with Persona
            </Button>
          </ModalFooter>
        </ModalContent>,
      )}
    </Modal>
  );
}

function SelectPersonaForm() {
  const { data: personaList } = api.author.list_form_modal.useQuery(undefined, {
    //  refetchOnMount: false,
    //  refetchOnWindowFocus: false
  });

  return (
    <Fragment>
      {personaList && (
        <AuthorRadioCard
          withName={false}
          label="Select a new profile to act as"
          name={'personaProfile'}
          options={personaList}
        />
      )}
    </Fragment>
  );
}
