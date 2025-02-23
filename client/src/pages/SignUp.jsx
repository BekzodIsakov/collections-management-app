import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
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
  Text,
  Link as ChakraLink,
  HStack,
} from "@chakra-ui/react";

import { useAuth } from "../context/Auth";
import { LanguageSelect, ThemeSwitcher } from "../components";
import { useForm } from "../hooks/useForm";
import { useMutation } from "@tanstack/react-query";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuth();
  const [values, handleChange] = useForm({ name: "", email: "", password: "" });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["user_singout"],
    mutationFn: (crendentails) => signUp(crendentails),
    onSuccess: () => navigate("/"),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { name, email, password } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, email, password });
  };

  return (
    <Flex
      minH='100vh'
      align='center'
      justify='center'
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={8}
        mx='auto'
        width={{ base: "100%", twSM: "450px" }}
        py={12}
        px={6}
      >
        <Heading as={"h1"} fontSize='4xl' textAlign={"center"}>
          {t("auth.headings.register")}
        </Heading>

        <Box
          rounded='md'
          bg={useColorModeValue("white", "gray.700")}
          boxShadow='lg'
          px={{ base: 6, twSM: 8 }}
          py={{ base: 8, twSM: 10 }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={5}>
              <FormControl id='name'>
                <FormLabel>{t("auth.name")}</FormLabel>
                <Input
                  required
                  name='name'
                  value={name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id='email'>
                <FormLabel>{t("auth.emailAddress")}</FormLabel>
                <Input
                  type='email'
                  required
                  name='email'
                  value={email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id='password'>
                <FormLabel>{t("auth.password")}</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    name='password'
                    value={password}
                    onChange={handleChange}
                  />
                  <InputRightElement mr={1}>
                    <Button size='sm' onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={3}>
                {error && <Text color='red.400'>{error.message}</Text>}
                <Button
                  type='submit'
                  isLoading={isPending}
                  loadingText='Submitting'
                  colorScheme='blue'
                >
                  {t("auth.register")}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
        <Text>
          {t("auth.hasAccount?")}&nbsp;&nbsp;
          <ChakraLink as={RouterLink} to='/signin'>
            {t("auth.login")}
          </ChakraLink>{" "}
          |{" "}
          <ChakraLink as={RouterLink} to='/'>
            {t("nav.mainPage")}
          </ChakraLink>
        </Text>

        <HStack pos='fixed' right='12' bottom='12'>
          <LanguageSelect />
          <ThemeSwitcher />
        </HStack>
      </Stack>
    </Flex>
  );
};

export default SignUp;
