/* eslint-disable import/default */
import {
  Checkbox,
  Field,
  type InputProps,
  Text,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface LabeledTextFieldProps {
  /** Field name. */
  name: string;
  label?: string;
  props?: InputProps;
}

const FormCheckbox = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ label, name, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    const error = Array.isArray(errors)
      ? errors[name]?.message || Object.entries(errors[name]?.types || {})
      : errors[name]?.message?.toString();
    const isErrorInField = errors[name] ? true : false;

    return (
      <Field.Root ref={ref} {...props} invalid={isErrorInField}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox.Root
              {...field}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            >
              <Checkbox.Control />
              <Checkbox.Label>
                <Text fontSize="sm">
                  {label ?? 'I agree to the Terms of use and Privacy Policy'}
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          )}
        />
        {error && (
          <Field.ErrorText fontSize="sm" color="red.500" text={error.toString()} />
        )}
      </Field.Root>
    );
  },
);

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;
