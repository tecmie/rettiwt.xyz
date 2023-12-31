import * as React from 'react';
import type { FormControlProps } from '@chakra-ui/form-control';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import {
  ComponentWithAs,
  type EditableInputProps,
  IconProps,
  Editable,
  EditableInput,
  EditablePreview,
  FormErrorMessage,
  ScaleFade,
} from '@chakra-ui/react';
import type { ComponentPropsWithoutRef, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';

export interface LabeledTextFieldProps extends EditableInputProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'file';
  outerProps?: PropsWithoutRef<FormControlProps>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  leftElement?: boolean;
  rightElement?: boolean;
  textSize?: string;
  props?: ComponentPropsWithoutRef<typeof Input>;
}

export const FormEditableInput = forwardRef<
  HTMLInputElement,
  LabeledTextFieldProps
>(
  (
    {
      label,
      outerProps,
      name,
      textSize,
      // ...props
    },
    ref,
  ) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext();

    const error = Array.isArray(errors)
      ? errors[name]?.message || Object.entries(errors[name]?.types || {})
      : errors[name]?.message?.toString();
    const isErrorInField = errors[name] ? true : false;

    const baseBorderColor = 'gray.100';
    const baseBorder = '0.25px solid';

    return (
      <FormControl
        display={'inline'}
        ref={ref}
        {...outerProps}
        isInvalid={isErrorInField}
      >
        <Editable
          color={'gray.700'}
          pr={1}
          display={'inline'}
          defaultValue={label}
        >
          <EditablePreview
            w={'fit-content'}
            textDecoration={'underline'}
            // borderBottom={"1px solid"}
            // borderRadius={'none'}
          />
          <Input
            as={EditableInput}
            {...register(name)}
            // {...props}
            outline={'none'}
            fontSize={'inherit'}
            variant={'flushed'}
            _focus={{
              // border: "0px",
              border: baseBorder,
              borderColor: baseBorderColor,
              outline: 'none',
            }}
            _focusVisible={{
              px: 2,
              py: 2,
              border: baseBorder,
              transition: 'all 0.1s ease-in-out',

              borderColor: baseBorderColor,
              borderRadius: 'lg',
              outline: 'none',
              // borderBottom: "1px solid",
              // boxShadow: "none",
              boxShadow: '30px 30px 60px #d9d9d9, -30px -30px 60px #ffffff',
            }}
            _active={{
              // border: "0px",
              border: baseBorder,
              borderColor: baseBorderColor,
              outline: 'none',
            }}
            maxW={textSize ?? '132px'}
            w={'max-content'}
            display={'inline'}
            name={name}
          />
        </Editable>

        <FormErrorMessage fontSize="xs" role="alert">
          {error?.toString()}
        </FormErrorMessage>
      </FormControl>
    );
  },
);

FormEditableInput.displayName = 'FormEditableInput';

export default FormEditableInput;
