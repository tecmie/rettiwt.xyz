/* eslint-disable import/default */
import { FormControl } from '@chakra-ui/form-control';
import {
  Checkbox,
  FormErrorMessage,
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
      <FormControl ref={ref} {...props} isInvalid={isErrorInField}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              <Text fontSize="sm">
                {label ?? 'I agree to the Terms of use and Privacy Policy'}
              </Text>
            </Checkbox>
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

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;
