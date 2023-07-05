import React from "react";
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
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../provider/authProvider";
import { useUserSignIn } from "../hooks/user";

const SignIn = () => {
  const { data, loading, errorMessage, onSignIn } = useUserSignIn();
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handlePasswordShowClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn({ email, password });
  };

  React.useEffect(() => {
    if (data) {
      setToken(data.token);
      setUser({
        name: data.user.name,
        isAdmin: data.user.isAdmin,
        id: data.user._id,
      });
      navigate("/", { replace: true });
    }
  }, [data, setToken, setUser, navigate]);

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
          p={8}
          rounded='lg'
          boxShadow='lg'
          bg={useColorModeValue("white", "gray.700")}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id='email'>
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id='password'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button size='sm' onClick={handlePasswordShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={1}>
                <Text color={"tomato"} fontSize={"sm"}>
                  {errorMessage}
                </Text>
                <Button
                  isLoading={loading}
                  loadingText='Submitting'
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