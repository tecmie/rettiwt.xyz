/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react/display-name */
import * as React from 'react';
import { useId } from 'react';
import {
  Box,
  type BoxProps,
  Circle,
  Field,
  HStack,
  Icon,
  Stack,
  type StackProps,
  Text,
  type UseRadioProps,
  chakra,
  RadioGroup,
} from '@chakra-ui/react';
import {
  type ComponentPropsWithoutRef,
  type PropsWithoutRef,
  forwardRef,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AiFillCheckCircle as CheckCircleIcon } from 'react-icons/ai';

interface RadioCardGroupProps<T> extends Omit<StackProps, 'onChange'> {
  name?: string;
  value?: T;
  defaultValue?: string;
  onChange?: (value: T) => void;
}

export interface FormRadioCardOptionProps {
  name: string;
  value: string;
  /** optional metadata for radio card  */
  extra?: React.ReactNode;
  metadata?: any;
  // metadata?: React.ReactNode
}

export interface FormRadioCardProps {
  /** Field name. */
  name: string;
  /** Field label. */
  label?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
  labelProps?: ComponentPropsWithoutRef<'label'>;
  options: FormRadioCardOptionProps[];
}

export const RadioCardGroup = forwardRef(
  <T extends string>(props: RadioCardGroupProps<T>, ref: any) => {
    const { children, name, defaultValue, value, onChange, ...rest } = props;

    return (
      <RadioGroup.Root
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        {...rest}
      >
        <Stack w="full" rounded="3xl">
          {children}
        </Stack>
      </RadioGroup.Root>
    );
  },
);

interface RadioCardProps extends BoxProps {
  value: string;
  radioProps?: UseRadioProps;
}

export const RadioCard = (props: RadioCardProps) => {
  const { radioProps, children, ...rest } = props;
  const id = useId();

  const styles = { p: 4, borderWidth: '1px', borderRadius: 'md' };
  return (
    <RadioGroup.Item
      value={props.value}
      asChild
    >
      <Box
        as="label"
        cursor="pointer"
        sx={styles}
        {...rest}
      >
        <Stack direction="row" align={'center'}>
          <RadioGroup.ItemIndicator>
            <Icon as={CheckCircleIcon} boxSize="4" color="link" />
          </RadioGroup.ItemIndicator>
          <HStack flex={1} justify="space-between">
            {children}
          </HStack>
        </Stack>
      </Box>
    </RadioGroup.Item>
  );
};

const FormRadioCard = forwardRef<HTMLInputElement, FormRadioCardProps>(
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
        alignItems={flex}
        justifyContent={flex}
        {...outerProps}
        invalid={isErrorInField}
      >
        <Field.Label {...labelProps}>{label}</Field.Label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RadioCardGroup
              defaultValue={options[0]?.value || ''}
              spacing="3"
              {...field}
            >
              {options.map((option) => (
                <RadioCard key={option.value} value={option.value}>
                  <Text color="muted" fontSize="sm">
                    {option.name}
                  </Text>
                  <Text color="emphasized" fontWeight="medium" fontSize="sm">
                    {/* Metadata is a React component, can be a react node to allow for flexibility */}
                    {option.extra}
                  </Text>
                </RadioCard>
              ))}
            </RadioCardGroup>
          )}
        />

        {error && (
          <Field.ErrorText fontSize="sm" color="red.500">
            {error.toString()}
          </Field.ErrorText>
        )}
      </Field.Root>
    );
  },
);

FormRadioCard.displayName = 'FormRadioCard';

export default FormRadioCard;
