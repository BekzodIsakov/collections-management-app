import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordShowClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Flex
      minH='100vh'
      align='center'
      justify='center'
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx='auto' maxW='lg' py={12} px={6}>
        <Stack align='center'>
          <Heading fontSize='4xl'>Sign in to your account</Heading>
        </Stack>

        <Box
          rounded='lg'
          bg={useColorModeValue("white", "gray.700")}
          boxShadow='lg'
          p={8}
        >
          <form>
            <Stack spacing={4}>
              <FormControl id='email'>
                <FormLabel>Email address</FormLabel>
                <Input type='email' required />
              </FormControl>
              <FormControl id='password'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? "text" : "password"} required />
                  <InputRightElement width='4.5rem'>
                    <Button size='sm' onClick={handlePasswordShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10}>
                {/*<Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
                >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"}>Forgot password?</Link>
              </Stack>*/}
                <Button
                  type='submit'
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
        <Box color='gray.500'>
          Don&apos;t have an account yet?&nbsp;&nbsp;
          <Link
            as={RouterLink}
            to='/signup'
            color={"blue.400"}
            fontWeight='bold'
          >
            Sign up
          </Link>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignIn;
