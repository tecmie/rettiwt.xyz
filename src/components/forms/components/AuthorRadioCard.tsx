import {
  FormControl,
  Box,
  FormLabel,
  Text,
  FormErrorMessage,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import { ComponentPropsWithoutRef, PropsWithoutRef, forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { RadioCardGroup, RadioCard } from './FormRadioCard';

export interface CardOptions {
  name: string;
  value: string;
  metadata: {
    avatar?: string;
    bio?: string;
    [key: string]: any;
  };
}

export interface AuthorRadioCardProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  options: CardOptions[];
}

const AuthorRadioCard = forwardRef<HTMLInputElement, AuthorRadioCardProps>(
  ({ name, label, options, outerProps, labelProps }, ref) => {
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
      <FormControl
        ref={ref}
        display="flex"
        flexDirection="column"
        alignItems={flex}
        justifyContent={flex}
        {...outerProps}
        isInvalid={isErrorInField}
      >
        <FormLabel {...labelProps}>{label}</FormLabel>
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
                <RadioCard key={option.value} value={option.value}>
                  <HStack color="emphasized" fontWeight="medium" fontSize="sm">
                    <Box w={'40px'} mr={1} px={2}>
                      <Avatar
                        src={option.metadata?.avatar}
                        boxSize="6"
                      ></Avatar>
                    </Box>

                    <Text
                      color="emphasized"
                      fontWeight="medium"
                      fontSize="sm"
                      noOfLines={1}
                      maxW={'xs'}
                    >
                      @{option.value}
                    </Text>
                  </HStack>

                  <Box textAlign={'right'}>
                    <Text color="muted" fontSize="sm">
                      {option.name}
                    </Text>
                  </Box>
                </RadioCard>
              ))}
            </RadioCardGroup>
          )}
        />

        {error && (
          <FormErrorMessage fontSize="sm" role="alert" color="red.500">
            {error.toString()}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  },
);

AuthorRadioCard.displayName = 'AuthorRadioCard';

export default AuthorRadioCard;
