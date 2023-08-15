import { Box, BoxProps, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'

export const Main = (props: BoxProps) => (
  <Box as="main" {...props}>
    <Stack spacing="8">
      <Stack spacing="3">
        <Heading as="h1" size="lg" color={useColorModeValue('gray.700', 'white')}>
          The shape of a cupcake
        </Heading>
        <Text color={useColorModeValue('blackAlpha.600', 'whiteAlpha.600')}>October 23, 2021</Text>
      </Stack>
      <Stack
        spacing="5"
        lineHeight="1.75"
        maxW="65ch"
        color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')}
      >
        <Text>
          Muffin cupcake sweet roll cake candy dragée jujubes toffee icing. Lemon drops sesame snaps
          muffin lemon drops soufflé carrot cake. Cheesecake topping jujubes bonbon oat cake dragée.
        </Text>
        <Text>
          Bear claw jujubes chupa chups pie croissant liquorice muffin. Jujubes jelly-o chocolate
          pastry halvah. Oat cake bonbon cookie jelly-o dessert. Jelly gummies gummi bears powder
          muffin cookie gingerbread wafer. Halvah apple pie brownie oat cake halvah oat cake
          fruitcake candy canes pudding. Jelly beans cheesecake sesame snaps brownie sugar plum
          chocolate bar. Danish shortbread dragée sesame snaps sesame snaps tootsie roll apple pie.
          Danish candy croissant dessert cake marshmallow. Cupcake chocolate cake halvah sugar plum
          pie dragée topping.
        </Text>
        <Text>
          Biscuit jujubes cake muffin bear claw jelly oat cake candy. Toffee dessert sesame snaps
          oat cake powder jelly-o cake danish apple pie. Danish jelly-o wafer halvah fruitcake
          marzipan chocolate cake marshmallow sugar plum. Bonbon tiramisu jujubes jujubes powder
          caramels lemon drops jelly.
        </Text>
        <Text>
          Shortbread gummies jujubes croissant candy. Pudding lollipop soufflé cotton candy lollipop
          liquorice jelly oat cake cupcake. Shortbread halvah jelly beans pastry candy canes sweet.
          Shortbread jujubes halvah chocolate bar ice cream pudding.
        </Text>
        <Text>
          Halvah chocolate bar biscuit marshmallow bonbon jelly candy oat cake tiramisu. Candy canes
          carrot cake icing powder chocolate jelly-o pastry marzipan. Sesame snaps croissant powder
          dragée bonbon muffin tart dessert croissant.
        </Text>
      </Stack>
    </Stack>
  </Box>
)
