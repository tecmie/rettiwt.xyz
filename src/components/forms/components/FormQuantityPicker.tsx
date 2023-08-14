/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from "react";
import React from "react";
import type {
  FormControlProps,
  IconButtonProps,
  UseControllableStateProps,
} from "@chakra-ui/react";
import {
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Text,
  useControllableState,
} from "@chakra-ui/react";
import { FiMinus, FiPlus } from "react-icons/fi";

/* Hook into react hook forms */
import type { Control } from "react-hook-form";
import { useFormContext, useController } from "react-hook-form";

interface FieldErrorProps {
  name?: string;
}

const QuantityPickerButton = (props: IconButtonProps) => (
  <IconButton
    colorScheme={"orange"}
    size="md"
    fontSize="md"
    _focus={{ boxShadow: "none" }}
    _focusVisible={{ boxShadow: "outline" }}
    {...props}
  />
);

export const FieldError: FC<FieldErrorProps> = ({ name }) => {
  const {
    formState: { errors },
  } = useFormContext();

  if (!name) {
    return null;
  }

  const error = errors[name];

  if (!error) {
    return null;
  }

  return <FormErrorMessage>{error.message as any}</FormErrorMessage>;
};

interface FormQuantityPickerProps extends UseControllableStateProps<number> {
  max?: number;
  min?: number;
  name: string;
  label?: string;
  /** control for useFormHook */
  control?: Control | any;
  required: boolean;
  rootProps?: FormControlProps;
}

export const FormQuantityPicker: FC<FormQuantityPickerProps> = (props) => {
  const {
    min = 1,
    max,
    name,
    label,
    required,
    control,
    rootProps,
    ...rest
  } = props;
  const [value, setValue] = useControllableState(rest);

  // const { register, setValue: setFormValue } = useFormContext()

  const { field } = useController({
    name,
    control,
    rules: { required: required },
  });

  const handleDecrement = () => {
    const decrementValue = value === min ? value : value - 1;
    setValue(decrementValue);
    field.onChange(decrementValue);
    // setFormValue(name, decrementValue)
  };
  const handleIncrement = () => {
    const incrementValue = value === max ? value : value + 1;
    setValue(incrementValue);
    field.onChange(incrementValue);

    // setFormValue(name, incrementValue)
  };

  return (
    <FormControl {...rootProps} {...field}>
      {label && (
        <FormLabel fontSize="sm" fontWeight="medium">
          {label}
        </FormLabel>
      )}
      <Flex
        borderRadius="xl"
        px="2"
        py={2}
        borderWidth="1px"
        justifyContent="space-between"
      >
        <QuantityPickerButton
          onClick={handleDecrement}
          icon={<FiMinus />}
          isDisabled={value === min}
          aria-label="Decrement"
        />
        <Center minW="8">
          <Text as="span" fontWeight="semibold" userSelect="none">
            {value}
          </Text>
        </Center>
        <QuantityPickerButton
          onClick={handleIncrement}
          icon={<FiPlus />}
          isDisabled={value === max}
          aria-label="Increment"
        />
      </Flex>
      <FieldError name={name} />
    </FormControl>
  );
};

FormQuantityPicker.displayName = "FormQuantityPicker";

export default FormQuantityPicker;
