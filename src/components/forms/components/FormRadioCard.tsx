/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react/display-name */
import * as React from 'react';
import {
  Field,
  HStack,
  RadioCard,
  Text,
} from '@chakra-ui/react';
import {
  type ComponentPropsWithoutRef,
  type PropsWithoutRef,
  forwardRef,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface FormRadioCardOptionProps {
  name: string;
  value: string;
  /** optional metadata for radio card  */
  extra?: React.ReactNode;
  metadata?: any;
  // metadata?: React.ReactNode
}

export interface FormRadioCardProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  options: FormRadioCardOptionProps[];
}

const FormRadioCard = forwardRef<HTMLInputElement, FormRadioCardProps>(
  ({ name, label, options, outerProps, labelProps }, ref) => {
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
              <HStack align="stretch" spacing="3">
                {options.map((option) => (
                  <RadioCard.Item key={option.value} value={option.value}>
                    <RadioCard.ItemHiddenInput ref={ref} />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemContent>
                        <RadioCard.ItemText color="muted" fontSize="sm">
                          {option.name}
                        </RadioCard.ItemText>
                        {option.extra && (
                          <Text color="emphasized" fontWeight="medium" fontSize="sm">
                            {option.extra}
                          </Text>
                        )}
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

FormRadioCard.displayName = 'FormRadioCard';

export default FormRadioCard;
