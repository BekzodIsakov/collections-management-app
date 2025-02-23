import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "@chakra-ui/icons";

import { useFetchTopics } from "@/hooks/topics";
import { useForm } from "../../../hooks/useForm";
import { editCollection } from "../../../utils/data";

export const CollectionEditModal = ({
  isOpen,
  onClose,
  collection,
  setCollection,
}) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [preview, setPreview] = useState("");

  const { title, description } = collection;
  const topicId = collection?.topic._id;

  const [values, handleChange] = useForm({
    title,
    description,
    topicId,
  });

  const fileInputRef = useRef(null);

  const { t } = useTranslation();

  const { topics, fetchTopics } = useFetchTopics();

  const params = useParams();

  // const {
  //   updatedCollection,
  //   updateCollection,
  //   loading: updatingCollection,
  // } = useCollectionEdit();

  const edit = useMutation({
    mutationFn: (formData) => editCollection(params.collectionId, formData),
    onSuccess: () => {
      onClose();
      setPreview("");
    },
  });

  const dragNDropBg = useColorModeValue("white", "gray.800");
  const dragNDropBorderColor = useColorModeValue("gray.300", "gray.500");

  function handleOnSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("topic", values.topicId);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    edit.mutate(formData);
  }

  function handleImageSelect(e) {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(undefined);
      return;
    }

    setSelectedImage(e.target.files[0]);
  }

  function resetSelectedFile() {
    fileInputRef.current.value = "";
    setSelectedImage("");
  }

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  // useEffect(() => {
  //   if (updatedCollection) {
  //     setCollection(updatedCollection);
  //     onClose();
  //     setPreview("");
  //   }
  // }, [updatedCollection]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
      <ModalOverlay />
      <ModalContent mx='3' pb='3'>
        <ModalHeader>{t("global.editCollection")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleOnSubmit}>
            <Stack spacing='3' mb='7'>
              <FormControl>
                <FormLabel>{t("global.name")}</FormLabel>
                <Input
                  name={"title"}
                  value={values.title}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t("global.description")}</FormLabel>
                <Textarea
                  name={"description"}
                  value={values.description}
                  onChange={handleChange}
                ></Textarea>
              </FormControl>

              <FormControl>
                <FormLabel>{t("global.topic")}</FormLabel>
                <Select
                  name='selectedTopic'
                  value={values.topicId}
                  onChange={handleChange}
                >
                  {topics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.title}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  h={{ base: preview ? "400" : "200", md: "200" }}
                  spacing={3}
                >
                  <Box
                    flex='1'
                    borderColor={dragNDropBorderColor}
                    borderStyle='dashed'
                    borderWidth='2px'
                    rounded='md'
                    shadow='sm'
                    role='group'
                    transition='all 150ms ease-in-out'
                    _hover={{
                      shadow: "lg",
                    }}
                  >
                    <Box position='relative' height='100%' width='100%'>
                      <Box
                        position='absolute'
                        top='0'
                        left='0'
                        height='100%'
                        width='100%'
                        display='flex'
                        flexDirection='column'
                      >
                        <Stack
                          height='100%'
                          width='100%'
                          display='flex'
                          alignItems='center'
                          justify='center'
                          spacing='4'
                          bgColor={dragNDropBg}
                        >
                          <Stack p='4' textAlign='center' spacing='1'>
                            <Heading
                              fontSize='lg'
                              color='gray.700'
                              fontWeight='semibold'
                            >
                              {t("global.dropImageHere")}
                            </Heading>
                            <Text fontWeight='light'>
                              {t("global.orClick")}
                            </Text>
                          </Stack>
                        </Stack>
                        <Input
                          name='image'
                          onChange={handleImageSelect}
                          ref={fileInputRef}
                          type='file'
                          height='100%'
                          width='100%'
                          position='absolute'
                          top='0'
                          left='0'
                          opacity='0'
                          aria-hidden='true'
                          accept='image/*'
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box flex={{ base: preview ? "1" : "0", md: "1" }}>
                    <Image
                      src={preview}
                      width={preview ? "100%" : 0}
                      height={"100%"}
                      objectFit={"cover"}
                      rounded={"md"}
                    />
                    {preview && (
                      <IconButton
                        onClick={resetSelectedFile}
                        icon={<CloseIcon />}
                        size='xs'
                        pos='absolute'
                        top='1'
                        right='1'
                      />
                    )}
                  </Box>
                </Stack>
              </FormControl>
            </Stack>
            <Button
              type='submit'
              colorScheme='telegram'
              isLoading={edit.isPending}
            >
              {t("global.done")}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
