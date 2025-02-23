import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Menu, Boxes } from "lucide-react";
import {
  Box,
  Flex,
  HStack,
  Link as ChakraLink,
  useDisclosure,
  useColorModeValue,
  Button,
  Divider,
} from "@chakra-ui/react";

import {
  ThemeSwitcher,
  SearchModal,
  SearchButton,
  LanguageSelect,
} from "../index";
import Persona from "../Persona";
import { useAuth } from "../../context/Auth";
import { useNavData } from "./navData";
import ChakraDrawer from "../Drawer";
import { GitHubLink } from "../GithubLink";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const { token } = useAuth();
  const { t } = useTranslation();
  const { navData } = useNavData();
  const drawerBtnRef = useRef();

  return (
    <Box
      position='sticky'
      zIndex='docked'
      top='0'
      boxShadow='md'
      bg={useColorModeValue("gray.50", "gray.900")}
      px={{ base: 3, md: 8 }}
      py={2}
    >
      <Box maxW={1200} mx={"auto"}>
        <Flex alignItems='center' justifyContent='space-between' gap={"8px"}>
          <HStack gap={33}>
            <ChakraLink
              as={NavLink}
              to={"/"}
              color={"inherit"}
              borderRadius={"md"}
              p={1}
              backgroundColor={useColorModeValue("gray.100", "gray.700")}
            >
              <Boxes size={35} fill='black' strokeWidth={1.1} color='white' />
            </ChakraLink>

            <HStack gap={25} display={{ base: "none", twSM: "flex" }}>
              {navData.map((link, index) => (
                <ChakraLink
                  key={index}
                  as={NavLink}
                  to={link.to}
                  _activeLink={{ fontWeight: "extrabold", color: "blue.600" }}
                >
                  {link.label}
                </ChakraLink>
              ))}
            </HStack>
          </HStack>

          <HStack gap={{ base: "12px", xs: "20px" }}>
            <HStack gap={{ base: "8px", md: "12px" }}>
              {token ? (
                <Persona />
              ) : (
                <Button
                  as={NavLink}
                  whiteSpace={"nowrap"}
                  variant={"outline"}
                  to='/signin'
                >
                  {t("auth.login")}
                </Button>
              )}
            </HStack>
          </HStack>
        </Flex>

        <Divider my={3} display={{ base: "block", twSM: "block" }} />

        <HStack justifyContent={"space-between"}>
          <Button
            ref={drawerBtnRef}
            onClick={onDrawerOpen}
            display={{ base: "initial", twSM: "none" }}
          >
            {isDrawerOpen ? <X /> : <Menu />}
          </Button>
          <ChakraDrawer
            isOpen={isDrawerOpen}
            onClose={onDrawerClose}
            drawerBtnRef={drawerBtnRef}
            onSearchBarOpen={onOpen}
          />

          <HStack gap={{ base: "8px", md: "12px" }}>
            <Button variant={"outline"}>
              <GitHubLink />
            </Button>
            <LanguageSelect />
            <ThemeSwitcher />
            <SearchButton onOpen={onOpen} />
          </HStack>
        </HStack>

        {isOpen && (
          <SearchModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
        )}
      </Box>
    </Box>
  );
};

export default Header;
