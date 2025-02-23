import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Select as ReactSelect } from "chakra-react-select";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { useFetchAllTags } from "@/hooks/tags";
import { useCreateItem } from "@/hooks/items";
import { useCurrentUser } from "@/context/currentUserProvider";

const CreateItemModal = ({
  isOpen,
  onClose,
  optionalItemFields,
  collection,
  setCollection,
}) => {
  const { currentUser } = useCurrentUser();
  const [name, setName] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [optionalFields, setOptionalFields] = React.useState(null);
  const [options, setOptions] = React.useState([]);

  const params = useParams();

  const { t } = useTranslation();

  const { tags, fetchTags } = useFetchAllTags();

  const { loading, createdItem, createItem } = useCreateItem();

  function handleOnSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("parentCollection", params.id);
    formData.append(
      "tags",
      selectedTags.map((tag) => tag.value)
    );
    formData.append(
      "optionalFields",
      JSON.stringify(Object.values(optionalFields))
    );

    createItem({
      name,
      parentCollection: params.collectionId,
      tags: selectedTags.map((tag) => tag.value),
      optionalFields: JSON.stringify(Object.values(optionalFields)),
      author: currentUser._id,
    });
  }

  function handleOptionalFields(field) {
    setOptionalFields((prev) => ({
      ...prev,
      [field.name]: { name: field.name, type: field.type, value: field.value },
    }));
  }

  const optionalFieldsElements = [];
  if (optionalFields) {
    optionalItemFields.forEach((field) => {
      switch (field.type) {
        case "textarea":
          optionalFieldsElements.push(
            <FormControl key={field.name}>
              <FormLabel textTransform={"capitalize"}>{field.name}</FormLabel>
              <Textarea
                value={optionalFields?.[field.name].value}
                onChange={(e) => {
                  handleOptionalFields({
                    name: field.name,
                    type: field.type,
                    value: e.target.value,
                  });
                }}
              ></Textarea>
            </FormControl>
          );
          break;
        case "checkbox":
          optionalFieldsElements.push(
            <FormControl key={field.name}>
              <FormLabel textTransform={"capitalize"}>{field.name}</FormLabel>
              <Checkbox
                value={optionalFields?.[field.name].value}
                onChange={(e) => {
                  handleOptionalFields({
                    name: field.name,
                    type: field.type,
                    value: e.target.checked,
                  });
                }}
              ></Checkbox>
            </FormControl>
          );
          break;
        default:
          optionalFieldsElements.push(
            <FormControl key={field.name}>
              <FormLabel textTransform={"capitalize"}>{field.name}</FormLabel>
              <Input
                type={field.type}
                value={optionalFields?.[field.name].value}
                onChange={(e) => {
                  handleOptionalFields({
                    name: field.name,
                    type: field.type,
                    value: e.target.value,
                  });
                }}
              />
            </FormControl>
          );
      }
    });
  }

  React.useEffect(() => {
    const _options = tags.map((tag) => ({
      label: tag.title,
      value: tag._id,
    }));
    setOptions(_options);
  }, [tags]);

  React.useEffect(() => {
    fetchTags();
  }, []);

  React.useEffect(() => {
    if (optionalItemFields) {
      const _optionalFields = {};
      optionalItemFields.forEach((field) => {
        switch (field.type) {
          case "checkbox":
            _optionalFields[field.name] = {
              name: field.name,
              type: field.type,
              value: false,
            };
            break;
          default:
            _optionalFields[field.name] = {
              name: field.name,
              type: field.type,
              value: "",
            };
        }
      });
      setOptionalFields(_optionalFields);
    }
  }, [optionalItemFields]);

  React.useEffect(() => {
    if (createdItem) {
      const _collection = { ...collection };
      _collection.items.push(createdItem);
      setCollection(_collection);
      onClose();
    }
  }, [createdItem]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
      <ModalOverlay />
      <ModalContent mx='3' pb='3'>
        <ModalHeader>{t("global.createNewItem")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleOnSubmit}>
            <VStack spacing='3' mb='7'>
              <FormControl>
                <FormLabel>{t("global.name")}</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </FormControl>
              {optionalFieldsElements}
              <FormControl>
                <FormLabel>{t("global.tags")}</FormLabel>
                <ReactSelect
                  isMulti
                  value={selectedTags}
                  onChange={setSelectedTags}
                  name='tags'
                  options={options}
                  closeMenuOnSelect={false}
                />
              </FormControl>
            </VStack>
            <Button type='submit' colorScheme='blue' isLoading={loading}>
              {t("global.create")}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateItemModal;
