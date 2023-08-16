import { FormControl, FormLabel } from '@chakra-ui/form-control';
import {
  Flex,
  FormErrorMessage,
  Textarea,
  type TextareaProps,
} from '@chakra-ui/react';
import type { ComponentPropsWithoutRef, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';

export interface LabeledTextFieldProps extends TextareaProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
}

export const FormTextarea = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ label, outerProps, labelProps, name, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext();

    const error = Array.isArray(errors)
      ? errors[name]?.message || Object.entries(errors[name]?.types || {})
      : errors[name]?.message?.toString();
    const isErrorInField = errors[name] ? true : false;

    return (
      <FormControl ref={ref} {...outerProps} isInvalid={isErrorInField}>
        <Flex align="center" justify="space-between">
          {label && (
            <FormLabel fontSize="sm" {...labelProps}>
              {label}
            </FormLabel>
          )}
        </Flex>
        <Textarea
          w="full"
          size="lg"
          fontSize="sm"
          borderRadius="lg"
          _placeholder={{ fontSize: 'sm' }}
          disabled={isSubmitting}
          {...register(name)}
          {...props}
        />
        {error && (
          <FormErrorMessage fontSize="sm" role="alert">
            {error.toString()}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  },
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
