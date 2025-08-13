/* eslint-disable @typescript-eslint/unbound-method */

import type {
  BoxProps,
  StackProps,
  UseCheckboxGroupProps,
  UseCheckboxProps,
} from '@chakra-ui/react';
import {
  Box,
  Checkbox,
  Stack,
  useCheckbox,
  useCheckboxGroup,
} from '@chakra-ui/react';
import { useId } from 'react';
import * as React from 'react';

type CheckboxCardGroupProps = StackProps & UseCheckboxGroupProps;

export const FormCheckboxCardGroup = (props: CheckboxCardGroupProps) => {
  const { children, defaultValue, value, onChange, ...rest } = props;
  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue,
    value,
    onChange,
  });

  const cards = React.useMemo(
    () =>
      React.Children.toArray(children)
        .filter<React.ReactElement<RadioCardProps>>(React.isValidElement)
        .map((card) => {
          return React.cloneElement(card, {
            checkboxProps: getCheckboxProps({
              value: card.props.value,
            }),
          });
        }),
    [children, getCheckboxProps],
  );

  return <Stack {...rest}>{cards}</Stack>;
};

interface RadioCardProps extends BoxProps {
  value: string;
  checkboxProps?: UseCheckboxProps;
}

export const FormCheckboxCard = (props: RadioCardProps) => {
  const { checkboxProps, children, ...rest } = props;
  const { getInputProps, getCheckboxProps, getLabelProps, state } =
    useCheckbox(checkboxProps);
  const id = useId();
  const styles = { p: 4, borderWidth: '1px', borderRadius: 'md' };

  return (
    <Box
      as="label"
      cursor="pointer"
      {...getLabelProps()}
      sx={{
        '.focus-visible + [data-focus]': {
          boxShadow: 'outline',
          zIndex: 1,
        },
      }}
    >
      <input {...getInputProps()} aria-labelledby={id} />
      <Box sx={styles} {...getCheckboxProps()} {...rest}>
        <Stack direction="row">
          <Box flex="1">{children}</Box>
          <Checkbox
            pointerEvents="none"
            focusable={false}
            checked={state.isChecked}
            alignSelf="start"
          />
        </Stack>
      </Box>
    </Box>
  );
};
