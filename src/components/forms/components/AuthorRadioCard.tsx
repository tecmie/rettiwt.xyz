import {
  Field,
  Box,
  Text,
  Avatar,
  HStack,
  RadioCard,
} from '@chakra-ui/react';
import {
  type ComponentPropsWithoutRef,
  type PropsWithoutRef,
  forwardRef,
} from 'react';
import { useFormContext, Controller } from 'react-hook-form';

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
  outerProps?: PropsWithoutRef<Record<string, unknown>>;
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

    return (
      <Field.Root
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        {...outerProps}
        invalid={isErrorInField}
      >
        {label && <Field.Label {...labelProps}>{label}</Field.Label>}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RadioCard.Root
              {...field}
            >
              <HStack align="stretch" spacing="3" flexWrap="wrap">
                {options.map((option) => (
                  <RadioCard.Item
                    key={option.value}
                    // This is unsafe, value is a string, but we want an object returned
                    value={JSON.stringify(option)}
                  >
                    <RadioCard.ItemHiddenInput ref={ref} />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemContent>
                        <HStack color="emphasized" fontWeight="medium" fontSize="sm">
                          <Box w={'40px'} mr={1} px={2}>
                            <Avatar.Root boxSize="6">
                              <Avatar.Image alt={option.name} src={option.avatar || undefined} />
                              <Avatar.Fallback name={option.name} fontWeight={'700'} />
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
                      </RadioCard.ItemContent>
                      <RadioCard.ItemIndicator />
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </HStack>
            </RadioCard.Root>
          )}
        />

        {error && (
          <Field.ErrorText fontSize="sm" color="red.500">
            {error.toString()}
          </Field.ErrorText>
        )}
      </Field.Root>
    );
  },
);

AuthorRadioCard.displayName = 'AuthorRadioCard';

export default AuthorRadioCard;
