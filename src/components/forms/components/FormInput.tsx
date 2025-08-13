import * as React from 'react';
import type {
  ComponentWithAs,
  IconProps,
  InputElementProps,
} from '@chakra-ui/react';
import { Field, Input, InputGroup, Icon } from '@chakra-ui/react';
import type { ComponentPropsWithoutRef, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';

export interface LabeledTextFieldProps extends InputElementProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'file';
  outerProps?: PropsWithoutRef<Record<string, unknown>>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  leftElement?: boolean;
  rightElement?: boolean;
  icon?: ComponentWithAs<'svg', IconProps>;
  props?: ComponentPropsWithoutRef<typeof Input>;
}

export const FormInput = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  (
    {
      label,
      outerProps,
      _type,
      icon,
      labelProps,
      name,
      leftElement,
      rightElement,
      ...props
    },
    ref,
  ) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext();
    // const error = Array.isArray(errors[name]) ? errors[name]?.types?.join(', ') : errors[name]?.message || errors[name];
    const error = Array.isArray(errors)
      ? errors[name]?.message || Object.entries(errors[name]?.types || {})
      : errors[name]?.message?.toString();
    const isErrorInField = errors[name] ? true : false;

    return (
      <Field.Root ref={ref} {...outerProps} invalid={isErrorInField}>
        {label && (
          <Field.Label fontSize="sm" {...labelProps}>
            {label}
          </Field.Label>
        )}
        <InputGroup>
          {leftElement && (
            <InputGroup.Addon placement="start">
              <Icon as={icon} color="primary.500" />
            </InputGroup.Addon>
          )}
          <Input
            disabled={isSubmitting}
            {...register(
              name,
              //   {
              //   valueAsNumber: type === "number",
              // }
            )}
            placeholder={{ fontSize: 'sm' } as Record<string, unknown>}
            fontSize="sm"
            {...props}
          />
          {rightElement && (
            <InputGroup.Addon placement="end">
              <Icon as={icon} color="primary.500" />
            </InputGroup.Addon>
          )}
        </InputGroup>
        {error && (
          <Field.ErrorText fontSize="xs">
            {error.toString()}
          </Field.ErrorText>
        )}
      </Field.Root>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
