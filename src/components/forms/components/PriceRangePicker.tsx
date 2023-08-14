import type { RangeSliderProps } from "@chakra-ui/react";
import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";

export const PriceRangePicker = (props: RangeSliderProps) => {
  const value = props.defaultValue || props.value;
  return (
    <RangeSlider
      colorScheme="blue"
      step={10}
      // eslint-disable-next-line jsx-a11y/aria-proptypes
      aria-label={["minimum price", "maximum price"]}
      {...props}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      {value?.map((_, index) => (
        <RangeSliderThumb
          w="5"
          h="5"
          borderWidth="1px"
          borderColor="gray.200"
          key={index}
          index={index}
        />
      ))}
    </RangeSlider>
  );
};
