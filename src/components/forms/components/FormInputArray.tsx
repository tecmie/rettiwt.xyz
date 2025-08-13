import type { ComponentWithAs, IconProps, InputProps } from '@chakra-ui/react';
import {
  Button,
  Field,
  Icon,
  Input,
  InputGroup,
  Stack,
} from '@chakra-ui/react';
import type { PropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CgClose } from 'react-icons/cg';

export interface InputFieldArrayProps {
  /** Field name. */
  name: string;

  /** Add more text. */
  addMoreText?: string;

  /** array limit numer  */
  limit?: number;

  /** Field label. */
  label?: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'file';
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
  labelProps?: Record<string, unknown>;
  leftElement?: boolean;
  icon?: ComponentWithAs<'svg', IconProps>;
  props?: InputProps;
}

/**
 * @see https://react-hook-form.com/api/useformcontext
 * @name FormInputArray
 * @description a form input that can create array fields with react hook form
 */
export const FormInputArray = forwardRef<
  HTMLInputElement,
  InputFieldArrayProps
>(
  (
    {
      label,
      outerProps,
      icon,
      limit,
      labelProps,
      addMoreText,
      name,
      leftElement,
      ...props
    },
    ref,
  ) => {
    const {
      register,
      control,
      formState: { isSubmitting, errors },
    } = useFormContext();
    const { fields, append, remove } = useFieldArray({
      control,
      name: name,
    });

    const _handleArrayAppend = () =>
      limit && fields.length < limit && append(' ');
    const error = Array.isArray(errors)
      ? errors[name]?.message || Object.entries(errors[name]?.types || {})
      : errors[name]?.message?.toString();
    const isErrorInField = errors[name] ? true : false;

    return (
      <Field.Root ref={ref} {...outerProps} invalid={isErrorInField}>
        {label && (
          <Field.Label color="default" fontSize="sm" {...labelProps}>
            {label}
          </Field.Label>
        )}
        <Stack>
          {fields.map((field, index) => (
            <fieldset key={field.id}>
              <InputGroup>
                {leftElement && (
                  <InputGroup.Addon placement="start">
                    <Icon as={icon} color="primary.500" />
                  </InputGroup.Addon>
                )}
                <Input
                  size="lg"
                  fontSize="md"
                  _placeholder={{ fontSize: 'sm' }}
                  disabled={isSubmitting}
                  {...register(`${name}.${index}`)}
                  {...props}
                />

                <InputGroup.Addon placement="end">
                  <Icon
                    p={1}
                    fontSize="lg"
                    border="1px"
                    rounded="full"
                    cursor="pointer"
                    mt={2}
                    onClick={() => remove(index)}
                    as={CgClose}
                  />
                </InputGroup.Addon>
              </InputGroup>
            </fieldset>
          ))}
          <Button
            size="sm"
            disabled={fields.length == limit}
            variant="ghost"
            justifySelf="flex-end"
            justifyContent="flex-end"
            w="max-content"
            onClick={_handleArrayAppend}
          >
            {addMoreText ?? '+'}
          </Button>
        </Stack>
        <Field.ErrorText fontSize="sm">
          {error?.toString()}
        </Field.ErrorText>
      </Field.Root>
    );
  },
);

FormInputArray.displayName = 'FormInputArray';

export default FormInputArray;
