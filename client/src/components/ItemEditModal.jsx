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
import React from "react";
import { useFetchAllTags } from "../hooks/tags";
import { useParams } from "react-router-dom";
import { Select as ReactSelect } from "chakra-react-select";
import { useCreateItem, useEditItem, useFetchItem } from "../hooks/items";

const EditItemModal = ({
  isOpen,
  onClose,
  onEdit,
  optionalItemFields,
  collection,
  setCollection,
  selectedItemId,
}) => {
  const [name, setName] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [optionalFields, setOptionalFields] = React.useState(null);
  const [options, setOptions] = React.useState([]);

  const { tags, fetchTags } = useFetchAllTags();
  console.log({ name, optionalFields, selectedTags, options, tags });

  const { loading, errorMessage, item: editedItem, editItem } = useEditItem();

  const { item, setItem, fetchItem } = useFetchItem();
  console.log({ item });

  const params = useParams();

  function handleOnSubmit(e) {
    e.preventDefault();
    console.log({
      name,
      tags: selectedTags.map((tag) => tag.value),
      optionalFields: Object.values(optionalFields),
      parentCollection: params.id,
    });

    editItem(selectedItemId, {
      name,
      parentCollection: params.id,
      tags: selectedTags.map((tag) => tag.value),
      optionalFields: JSON.stringify(Object.values(optionalFields)),
    });
  }

  function handleOptionalFields(field) {
    console.log({ field });
    setOptionalFields((prev) => ({
      ...prev,
      [field.name]: { name: field.name, type: field.type, value: field.value },
    }));
  }

  const optionalFieldsElements = [];
  console.log({ optionalItemFields });
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
    if (item) {
      setName(item.name);
      const _selectedTags = item.tags.map((tag) => {
        for (let i = 0; i < tags.length; i++) {
          if (tags[i]._id == tag) {
            return {
              label: tags[i].title,
              value: tags[i]._id,
            };
          }
        }
      });
      setSelectedTags(_selectedTags);

      const parsedOptionalFields = item.optionalFields
        ? JSON.parse(item.optionalFields)
        : [];
      const _optionalFields = {};
      parsedOptionalFields.forEach(({ name, type, value }) => {
        _optionalFields[name] = {
          name,
          type,
          value,
        };
      });
      setOptionalFields(_optionalFields);
    }
  }, [item]);

  React.useEffect(() => {
    // if (tags.length) setSelectedTags(tags[0]._id);
    const _options = tags.map((tag) => ({
      label: tag.title,
      value: tag._id,
    }));
    setOptions(_options);
  }, [tags]);

  React.useEffect(() => {
    fetchItem(selectedItemId);
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
    if (editedItem) {
      console.log({ editedItem });
      const _collection = { ...collection };
      _collection.items = collection.items.map((item) => {
        if (editedItem._id === item._id) {
          return editedItem;
        }
        return item;
      });
      setCollection(_collection);
      onClose();
    }
  }, [editedItem]);

  // React.useEffect(() => {
  //   if (createdItem) {
  //     const _collection = { ...collection };
  //     _collection.items.push(createdItem);
  //     setCollection(_collection);
  //     onClose();
  //   }
  // }, [createdItem]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
      <ModalOverlay />
      <ModalContent mx='3' pb='3'>
        <ModalHeader>Create item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleOnSubmit}>
            <VStack spacing='3' mb='7'>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              {optionalFieldsElements}
              <FormControl>
                <FormLabel>Tags</FormLabel>
                <ReactSelect
                  isMulti
                  value={selectedTags}
                  onChange={setSelectedTags}
                  name='tags'
                  options={options}
                  closeMenuOnSelect={false}
                  // onChange={(e) => console.log(e.target.value)}
                />
              </FormControl>
            </VStack>
            <Button type='submit' colorScheme='blue' isLoading={loading}>
              Edit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditItemModal;
