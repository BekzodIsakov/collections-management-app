import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { DeleteModal, ItemsTable, Spinner } from "@/components";
import { CollectionEditModal } from "./collection-page/components/CollectionEditModal";
import { useDeleteCollectionImage } from "@/hooks/collections";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  deleteCollection as deleteCollectionById,
  fetchCollection as fetchCollectionById,
} from "../utils/data";

const CollectionManagement = () => {
  const params = useParams();
  const { collectionId } = params;
  const navigate = useNavigate();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: closeEditModal,
  } = useDisclosure();

  const { isPending, isError, error, data } = useQuery({
    queryKey: [collectionId],
    queryFn: () => fetchCollectionById(collectionId),
    enabled: !isEditModalOpen,
  });

  const deletion = useMutation({
    mutationFn: () => deleteCollectionById(collectionId),
    onSuccess: () => {
      closeDeleteModal();
      navigate(-1);
    },
  });

  const { t } = useTranslation();

  const {
    loading: deletingCollectionImage,
    updatedCollection: collectionWithoutImage,
    deleteCollectionImage,
  } = useDeleteCollectionImage();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: closeDeleteModal,
  } = useDisclosure();

  if (isPending) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  if (isError) {
    console.log(error);
    return <Text color='orange'>error</Text>;
  }

  if (data) {
    const collection = data.data;

    return (
      <Box>
        <Stack
          justifyContent='space-between'
          mb='2'
          direction={{ base: "column", sm: "row" }}
        >
          <Heading as='h1' size='lg' wordBreak='break-all'>
            {collection.title}
          </Heading>
          <Wrap spacing='2'>
            <Button
              onClick={onEditModalOpen}
              size='xs'
              leftIcon={<EditIcon />}
              colorScheme='telegram'
            >
              {t("global.edit")}
            </Button>
            <Button
              onClick={onDeleteModalOpen}
              size='xs'
              leftIcon={<DeleteIcon />}
              colorScheme='red'
            >
              {t("global.delete")}
            </Button>
          </Wrap>
        </Stack>
        <Box mb='10'>
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow='hidden'
            variant='outline'
          >
            <Box pos={"relative"}>
              {collection?.image && (
                <>
                  <Image
                    objectFit='cover'
                    maxW={{ base: "100%", sm: "200px" }}
                    width={"100%"}
                    height={"100%"}
                    src={collection?.image?.location}
                    alt={collection?.image?.originalname.split(".")[0]}
                  />
                  <Box pos='absolute' top={1} right={1}>
                    <Popover>
                      {({ onClose }) => (
                        <>
                          <PopoverTrigger>
                            <IconButton
                              size={"xs"}
                              aria-label='Search database'
                              bgColor={"rgba(0, 0, 0, 0.4)"}
                              icon={<DeleteIcon color={"red.400"} />}
                              _hover={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                              title='Delete image'
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>
                              <Text as='b'>
                                {t("global.deleteCollectionImage")}
                              </Text>
                            </PopoverHeader>
                            <PopoverBody>
                              <Text mb={"2"}>{t("global.areYouSure")}</Text>
                              <HStack>
                                <Button
                                  size='xs'
                                  colorScheme={"red"}
                                  isLoading={deletingCollectionImage}
                                  onClick={() =>
                                    deleteCollectionImage(params.collectionId)
                                  }
                                >
                                  {t("global.yes")}
                                </Button>
                                <Button
                                  size='xs'
                                  onClick={onClose}
                                  colorScheme='telegram'
                                >
                                  {t("global.cancel")}
                                </Button>
                              </HStack>
                            </PopoverBody>
                          </PopoverContent>
                        </>
                      )}
                    </Popover>
                  </Box>
                </>
              )}
            </Box>

            <Stack flexGrow={1}>
              <CardBody>
                <Box mb={2}>
                  {t("global.name")}
                  :&nbsp;
                  <Text fontWeight={"semibold"} display='inline-block'>
                    {collection.title}
                  </Text>{" "}
                </Box>
                <Flex mb={2}>
                  {t("global.description")}
                  :&nbsp;
                  <Text fontWeight={"semibold"} display='inline-block' ml='3'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {collection.description}
                    </ReactMarkdown>
                  </Text>
                </Flex>
                <Box mb={2}>
                  {t("global.author")}
                  :&nbsp;
                  <Text fontWeight={"semibold"} as={"b"}>
                    {collection.author.name}
                  </Text>{" "}
                </Box>
                <Box mb='2'>
                  {t("global.topic")}
                  :&nbsp;
                  <Badge
                    rounded={"sm"}
                    fontWeight={"semibold"}
                    colorScheme='blue'
                  >
                    {collection.topic.title}
                  </Badge>
                </Box>
              </CardBody>
            </Stack>
          </Card>
        </Box>
        <ItemsTable collectionId={collection?._id} />
        {isEditModalOpen && (
          <CollectionEditModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            collection={collection}
            // setCollection={setCollection}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onDelete={deletion.mutate}
            modalTitle={t("global.deleteCollection")}
            isLoading={deletion.isPending}
          />
        )}
      </Box>
    );
  }
};

export default CollectionManagement;
