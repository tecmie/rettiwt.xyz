import {
  Field,
  Box,
  Text,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import {
  type ComponentPropsWithoutRef,
  type PropsWithoutRef,
  forwardRef,
} from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { RadioCardGroup, RadioCard } from './FormRadioCard';

export interface CardOptions {
  name: string;
  value: string;
  avatar: string | null;
  bio: string | null;
  [key: string]: unknown;
}

export interface AuthorRadioCardProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  withName?: boolean;
  outerProps?: PropsWithoutRef<any>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  options: CardOptions[];
}

const AuthorRadioCard = forwardRef<HTMLInputElement, AuthorRadioCardProps>(
  ({ name, label, options, withName = true, outerProps, labelProps }, ref) => {
    const {
      formState: { errors },
      control,
    } = useFormContext();
    const error = Array.isArray(errors)
      ? errors[name]?.message || Object.entries(errors[name]?.types || {})
      : errors[name]?.message?.toString();
    const isErrorInField = errors[name] ? true : false;

    const flex = 'flex-start';

    return (
      <Field.Root
        ref={ref}
        display="flex"
        flexDirection="column"
        alignItems={flex}
        justifyContent={flex}
        {...outerProps}
        invalid={isErrorInField}
      >
        <Field.Label {...labelProps}>{label}</Field.Label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RadioCardGroup
              defaultValue={options[0]?.value || ''}
              spacing="3"
              {...field}
            >
              {options.map((option) => (
                <RadioCard
                  key={option.value}
                  // This is unsafe, value is a string, but we want an object returned
                  value={JSON.stringify(option)}
                >
                  <HStack color="emphasized" fontWeight="medium" fontSize="sm">
                    <Box w={'40px'} mr={1} px={2}>
                      <Avatar.Root boxSize="6">
                        <Avatar.Image src={option.avatar || undefined} />
                        <Avatar.Fallback fontWeight={'700'}>
                          {option.name.split(' ')[0]?.charAt(0)}
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </Box>

                    <Text
                      color="emphasized"
                      fontWeight="medium"
                      fontSize="sm"
                      lineClamp={1}
                      maxW={'xs'}
                    >
                      @{option.value}
                    </Text>
                  </HStack>

                  <Box textAlign={'right'}>
                    <Text color="muted" fontSize="sm">
                      {withName && option.name}
                    </Text>
                  </Box>
                </RadioCard>
              ))}
            </RadioCardGroup>
          )}
        />

        {error && (
          <Field.ErrorText fontSize="sm" color="red.500" text={error.toString()} />
        )}
      </Field.Root>
    );
  },
);

AuthorRadioCard.displayName = 'AuthorRadioCard';

export default AuthorRadioCard;
