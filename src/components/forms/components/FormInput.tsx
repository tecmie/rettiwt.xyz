import * as React from "react";
import type { FormControlProps } from "@chakra-ui/form-control";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import type {
  ComponentWithAs,
  IconProps,
  InputElementProps,
} from "@chakra-ui/react";
import { FormErrorMessage, Icon, InputLeftElement } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, PropsWithoutRef } from "react";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

export interface LabeledTextFieldProps extends InputElementProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number" | "tel" | "date" | "file";
  outerProps?: PropsWithoutRef<FormControlProps>;
  labelProps?: ComponentPropsWithoutRef<"label">;
  leftElement?: boolean;
  rightElement?: boolean;
  icon?: ComponentWithAs<"svg", IconProps>;
  props?: ComponentPropsWithoutRef<typeof Input>;
}

export const FormInput = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  (
    {
      label,
      outerProps,
      type,
      icon,
      labelProps,
      name,
      leftElement,
      rightElement,
      ...props
    },
    ref
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
      <FormControl ref={ref} {...outerProps} isInvalid={isErrorInField}>
        {label && (
          <FormLabel fontSize="sm" {...labelProps}>
            {label}
          </FormLabel>
        )}
        <InputGroup>
          {leftElement && (
            <InputLeftElement>
              <Icon as={icon} color="primary.500" />
            </InputLeftElement>
          )}
          <Input
            isDisabled={isSubmitting}
            {...register(
              name
              //   {
              //   valueAsNumber: type === "number",
              // }
            )}
            _placeholder={{ fontSize: "sm" }}
            fontSize="sm"
            {...props}
          />
          {rightElement && (
            <InputRightElement>
              <Icon as={icon} color="primary.500" />
            </InputRightElement>
          )}
        </InputGroup>
        <FormErrorMessage fontSize="xs" role="alert">
          {error?.toString()}
        </FormErrorMessage>
      </FormControl>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
