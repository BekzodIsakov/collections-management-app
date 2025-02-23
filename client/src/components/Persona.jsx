import {
  Avatar,
  HStack,
  Text,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  PopoverFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/Auth";
import { useMutation } from "@tanstack/react-query";

const Persona = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isPending, mutate } = useMutation({
    mutationKey: ["signout_user"],
    mutationFn: logout,
    onSuccess: () => navigate("/"),
  });

  return (
    <Popover placement='bottom-end' gutter={14}>
      <PopoverTrigger>
        <HStack cursor={"pointer"}>
          <Text
            fontWeight={"medium"}
            whiteSpace='nowrap'
            display={{ base: "none", sm: "block" }}
          >
            {user.name.split(" ")[0]}
          </Text>
          <Avatar name={user.name} size='sm' src={"/profile-img.jpg"} />
        </HStack>
      </PopoverTrigger>

      <PopoverContent width={"max-content"}>
        <PopoverBody>
          <HStack key={user.email} gap='4' justify={"end"}>
            <Stack gap='0'>
              <Text fontWeight='medium'>{user.name}</Text>
              <Text color='fg.muted' textStyle='sm'>
                {user.email}
              </Text>
            </Stack>
            <Avatar name={user.name} size='md' src={"/profile-img.jpg"} />
          </HStack>
        </PopoverBody>
        <PopoverFooter>
          <Stack align={"end"}>
            <Button
              onClick={mutate}
              isLoading={isPending}
              loadingText={t("auth.signOut")}
              colorScheme='red'
              variant='outline'
              size='sm'
            >
              {t("auth.signOut")}
            </Button>
          </Stack>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default Persona;
