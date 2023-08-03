import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const Comment = ({ src, name, comment }) => {
  const bgColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("blackAlpha.700", "gray.200");

  return (
    <HStack alignItems='flex-start'>
      <Avatar src={src} size='sm' name={name} />
      <VStack alignItems='flex-start' spacing='0' flexGrow='1'>
        <VStack
          spacing='0'
          bg={bgColor}
          rounded='2xl'
          px='3'
          py='2'
          alignItems='flex-start'
          fontSize='sm'
          width='100%'
        >
          <Text as='b' fontWeight='semibold' mb='0.5'>
            {name}
          </Text>
          <Box lineHeight='1.4'>{comment}</Box>
        </VStack>
        <HStack ml='1' mt='1'>
          <Button
            variant='unstyled'
            fontSize='xs'
            fontWeight='bold'
            color={textColor}
            height='max-content'
          >
            Like
          </Button>
          <Button
            variant='unstyled'
            fontSize='xs'
            fontWeight='bold'
            color={textColor}
            height='max-content'
          >
            Reply
          </Button>
          <Text fontSize='xs' ml='2' color='gray.500' fontWeight='medium'>
            4d
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default Comment;
