import * as React from "react";
import type { StackProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, PropsWithoutRef } from "react";
import { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface FormRadioProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  labelProps?: ComponentPropsWithoutRef<"label">;
  options: string[];
  direction?: StackProps["direction"];
}

const FormRadio = forwardRef<HTMLInputElement, FormRadioProps>(
  ({ name, label, options, outerProps, labelProps, direction }, ref) => {
    const {
      formState: { errors },
      control,
    } = useFormContext();
    const error = Array.isArray(errors)
      ? errors[name]?.message || Object.entries(errors[name]?.types || {})
      : errors[name]?.message?.toString();
    const isErrorInField = errors[name] ? true : false;
    const flex = "flex-start";

    return (
      <FormControl
        ref={ref}
        display="flex"
        isInvalid={isErrorInField}
        flexDirection="column"
        alignItems={flex}
        justifyContent={flex}
        {...outerProps}
      >
        <FormLabel {...labelProps}>{label}</FormLabel>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              <Stack spacing={2} direction={direction} align="flex-start">
                {options.map((option) => (
                  <Radio key={option} value={option}>
                    {option}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          )}
        />

        {error && (
          <FormErrorMessage fontSize="xs" role="alert">
            {error.toString()}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);

FormRadio.displayName = "FormRadio";

export default FormRadio;
