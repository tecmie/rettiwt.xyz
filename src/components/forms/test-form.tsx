'use client';

import { useForm, FormInput, AuthorRadioCard } from '@/components/forms';
import { Button, Container, Stack } from '@chakra-ui/react';
import { z } from 'zod';

const testFormSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  personaProfile: z.string().nonempty('Please select a persona'),
});

type TestFormValues = z.infer<typeof testFormSchema>;

// Mock data for testing
const mockPersonas = [
  { name: 'John Doe', value: 'johndoe', avatar: null, bio: 'Developer' },
  { name: 'Jane Smith', value: 'janesmith', avatar: null, bio: 'Designer' },
];

export function TestForm() {
  const handleSubmit = (data: TestFormValues) => {
    console.log('Form submitted:', data);
    alert(`Form submitted! Check console for data.`);
  };

  const { renderForm } = useForm<TestFormValues>({
    onSubmit: handleSubmit,
    schema: testFormSchema,
    defaultValues: {
      email: '',
      name: '',
      personaProfile: '@johndoe',
    },
  });

  return (
    <Container maxW="md" py={8}>
      {renderForm(
        <Stack spacing={6}>
          <FormInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
          />
          
          <FormInput
            name="name"
            label="Full Name"
            placeholder="Enter your name"
          />
          
          <AuthorRadioCard
            name="personaProfile"
            label="Select a Persona"
            options={mockPersonas}
          />
          
          <Button type="submit" colorScheme="blue" size="lg">
            Submit Form
          </Button>
        </Stack>
      )}
    </Container>
  );
}