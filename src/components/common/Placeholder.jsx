import { Flex, Text } from "@chakra-ui/react";

export default function Placeholder({ name }) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="55vh"
      bg="beige"
      borderRadius="3xl"
      border="1px dashed"
      borderColor="taupe"
    >
      <Text fontSize="2xl" fontWeight="bold" color="espresso">
        {name}
      </Text>
      <Text mt={2} color="espresso" opacity={0.6}>
        Coming in the next step
      </Text>
    </Flex>
  );
}
