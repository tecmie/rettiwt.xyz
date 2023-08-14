import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, PropsWithoutRef } from "react";
import { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface OptionProps {
  readonly value: string;
  readonly label: string;
}

export interface FormNativeSelectProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  labelProps?: ComponentPropsWithoutRef<"label">;
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

    const flex = "flex-start";

    return (
      <FormControl
        ref={ref}
        display="flex"
        flexDirection="column"
        isInvalid={isErrorInField}
        alignItems={flex}
        justifyContent={flex}
        {...outerProps}
      >
        <FormLabel {...labelProps} fontSize={"sm"}>
          {label}
        </FormLabel>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              fontSize="sm"
              bg={"bg-surface"}
              _placeholder={{ fontSize: "sm" }}
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
        <FormErrorMessage fontSize="sm" role="alert">
          {error?.toString()}
        </FormErrorMessage>
      </FormControl>
    );
  }
);

FormNativeSelect.displayName = "FormNativeSelect";

export default FormNativeSelect;
