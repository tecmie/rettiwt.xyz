import {
  Field,
  NativeSelect as Select,
} from '@chakra-ui/react';
import type { ComponentPropsWithoutRef, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface OptionProps {
  readonly value: string;
  readonly label: string;
}

export interface FormNativeSelectProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  options: OptionProps[];
}

const FormNativeSelect = forwardRef<HTMLInputElement, FormNativeSelectProps>(
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
      <Field.Root
        ref={ref}
        display="flex"
        flexDirection="column"
        invalid={isErrorInField}
        alignItems={flex}
        justifyContent={flex}
        {...outerProps}
      >
        <Field.Label {...labelProps} fontSize={'sm'}>
          {label}
        </Field.Label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              fontSize="sm"
              bg={'bg-surface'}
              _placeholder={{ fontSize: 'sm' }}
              {...field}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        />
        <Field.ErrorText fontSize="sm" text={error?.toString()} />
      </Field.Root>
    );
  },
);

FormNativeSelect.displayName = 'FormNativeSelect';

export default FormNativeSelect;
