// import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";

import { Spinner } from "@/components";
import { CreateCollectionModal } from "./collection-page/components/CreateCollectionModal";
import { fetchUserCollections } from "../utils/data";
import { CollectionsGrid } from "./main-page/components/CollectionsGrid";
import { useAuth } from "../context/Auth";

const UserPage = () => {
  const { t } = useTranslation();
  // const { currentUser, setCurrentUser } = useCurrentUser();
  // const { user, fetchUser } = useFetchUser();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const {data: user, isPending} = useQueries({
  //   queryKey: ["fetch_user"],
  //   queryFn: () => fetchUser(user.id),
  // });

  // async function fetchUser(id) {
  //   try {
  //     const result = await axios(`${import.meta.env.VITE_URL}/users/${id}`);
  //     return result.data;
  //   } catch (error) {
  //     console.error("Error fetching user.", error);
  //   }
  // }

  const { isError, error, data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["use_collections", user?._id],
    queryFn: () => fetchUserCollections(user?._id),
    enabled: !!user._id,
  });

  const collections = data?.data;
  console.log({ collections });

  // useEffect(() => {
  //   fetchUser();
  // }, [fetchUser]);

  // useEffect(() => {
  //   if (currentUser) fetchUserCollections(currentUser._id);
  // }, [currentUser]);

  // useEffect(() => {
  //   if (user) {
  //     setCurrentUser(user);
  //   }
  // }, [user, setCurrentUser]);

  if (isError) {
    return <Text colorScheme='red'>{error}</Text>;
  }

  if (user) {
    return (
      <>
        <div>
          <HStack spacing={8} align='start' mb={16}>
            <Avatar size='xl' src={"/profile-img.jpg"} name={user.name} />
            <VStack alignItems={"start"} spacing={3}>
              <div>
                <Heading as={"h1"} fontSize='2xl' fontWeight='bold'>
                  {user.name}
                </Heading>
                <Text color='gray.500'>{user.email}</Text>
              </div>

              <Badge
                colorScheme={user.isAdmin ? "red" : "blue"}
                px={2}
                py={1}
                borderRadius='full'
                textTransform={"uppercase"}
              >
                {user.isAdmin ? "admin" : "user"}
              </Badge>
            </VStack>
          </HStack>

          <Box>
            <HStack
              wrap={"wrap"}
              alignItems={"center"}
              justifyContent={"space-between"}
              mb={6}
            >
              <Box spacing={3} align='center'>
                <HStack spacing={4}>
                  <Heading fontSize='3xl' textAlign={"left"}>
                    {t("userPage.myCollections")}
                  </Heading>
                  {isFetching && <Spinner />}
                </HStack>
              </Box>
              <Button
                onClick={onOpen}
                colorScheme='linkedin'
                leftIcon={<AddIcon />}
              >
                {t("global.newCollection")}
              </Button>
            </HStack>

            {/* <UnorderedList>
              {data?.data.map((collection) => (
                <ListItem key={collection._id} mb={2}>
                  <Link to={`collections/${collection._id}`}>
                    {collection.title}
                  </Link>
                </ListItem>
              ))}
            </UnorderedList> */}
            <CollectionsGrid isLoading={isLoading} collections={collections} />
          </Box>
        </div>
        {isOpen && (
          <CreateCollectionModal
            isOpen={isOpen}
            onClose={onClose}
            fetchUserCollections={refetch}
          />
        )}
      </>
    );
  }
};

export default UserPage;
