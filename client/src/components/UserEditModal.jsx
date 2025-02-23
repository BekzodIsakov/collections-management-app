import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
} from "@chakra-ui/react";

// import { useFetchUser, useUpdateUser } from "../hooks/user";
import { useAuth } from "../context/Auth";
import { Spinner } from "./index";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axios";

const UserEditModal = ({ isOpen, onClose, userId, users, setUsers }) => {
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const { user } = useAuth();
  const { t } = useTranslation();
  // const { loading, user: currentUser, fetchUser } = useFetchUser();
  const navigate = useNavigate();

  const { mutate, isPending, data } = useMutation({
    mutationKey: ["update_user"],
    mutationFn: (updates) => updateUser(updates),
    onSuccess: () => {
      onClose();
    },
  });

  async function updateUser(userId, updates) {
    try {
      const response = await axios.patch(`/users/${userId}`, updates, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating user.", error);
    }
  }

  // const {
  //   loading: updatingUser,
  //   user: updatedUser,
  //   updateUser,
  // } = useUpdateUser();

  function handleOnSubmit(e) {
    e.preventDefault();
    mutate(userId, { name, isAdmin, isBlocked });
  }

  // useEffect(() => {
  //   if (userId) fetchUser(userId);
  // }, [userId]);

  // useEffect(() => {
  //   if (currentUser) {
  //     setName(currentUser.name);
  //     setIsAdmin(currentUser.isAdmin);
  //     setIsBlocked(currentUser.isBlocked);
  //   }
  // }, [currentUser]);

  function updateUsers() {
    const updatedUser = data;

    const updatedUsers = users.map((user) => {
      return user._id === updatedUser._id ? { ...updatedUser } : user;
    });
  }

  // useEffect(() => {
  //   if (updatedUser) {
  //     const _users = users.map((user) => {
  //       return user._id === updatedUser._id ? { ...updatedUser } : user;
  //     });

  //     if (user.id === updatedUser._id) {
  //       setUser({
  //         name: updatedUser.name,
  //         isAdmin: updatedUser.isAdmin,
  //         id: updatedUser._id,
  //       });
  //       navigate("/");
  //     }

  //     setUsers(_users);
  //     onClose();
  //   }
  // }, [updatedUser]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mx='3' pb='3'>
        <ModalHeader>{t("global.editUser")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isPending ? (
            <Spinner />
          ) : (
            <form onSubmit={handleOnSubmit}>
              <FormControl mb='5'>
                <FormLabel>{t("global.userName")}</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormControl>
              <HStack width='100%' mb='8'>
                <FormControl width='max-content' mr='8'>
                  <FormLabel>Admin</FormLabel>
                  <Switch
                    isChecked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    id='adminId'
                    colorScheme='telegram'
                  />
                </FormControl>
                <FormControl width='max-content'>
                  <FormLabel>{t("global.blocked")}</FormLabel>
                  <Switch
                    isChecked={isBlocked}
                    onChange={(e) => setIsBlocked(e.target.checked)}
                    id='blockId'
                    colorScheme='telegram'
                  />
                </FormControl>
              </HStack>

              <Button
                type='submit'
                colorScheme='telegram'
                isLoading={isPending}
              >
                {t("global.done")}
              </Button>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserEditModal;
