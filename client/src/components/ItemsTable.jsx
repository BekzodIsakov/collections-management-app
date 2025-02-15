import React from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Heading,
  Stack,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

import {
  CreateItemModal,
  DeleteModal,
  ItemEditModal,
  ReactTable,
} from "@/components";
import { useFetchCollectionItems } from "@/hooks/collections";
import { useItemDelete } from "@/hooks/items";

const ItemsTable = ({ collectionId }) => {
  const [selectedRow, setSelectedRow] = React.useState({});
  const [columns, setColumns] = React.useState([]);

  const selectedItemId = Object.keys(selectedRow)[0];

  const { t, i18n } = useTranslation();

  const { collection, setCollection, fetchCollection } =
    useFetchCollectionItems();

  const {
    loading: deletingItem,
    itemDeleted,
    setItemDeleted,
    deleteItem,
  } = useItemDelete();

  const [data, setData] = React.useState([]);

  const columnHelper = createColumnHelper();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();

  const {
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure();

  function getRowId(row) {
    return row.id;
  }

  React.useEffect(() => {
    if (collectionId) {
      fetchCollection(collectionId);
    }
  }, [collectionId]);

  React.useEffect(() => {
    if (itemDeleted) {
      closeDeleteModal();
      const updatedCollection = {
        ...collection,
      };
      updatedCollection.items = collection.items.filter(
        (item) => item._id !== selectedItemId
      );
      setCollection(updatedCollection);
      setSelectedRow({});
      setItemDeleted(false);
    }
  }, [itemDeleted]);

  React.useEffect(() => {
    if (collection) {
      const data = collection.items.map((item) => {
        const optionalFields = {};
        const parsedOptionalFields = JSON.parse(item.optionalFields);
        parsedOptionalFields.forEach((field) => {
          optionalFields[field.name] = String(field.value);
        });

        const tags = item.tags.map((tag) => tag.title);

        return {
          id: item._id,
          name: item.name,
          ...optionalFields,
          tags,
        };
      });

      setData(data);

      const _columns = [
        columnHelper.display({
          id: "select",
          cell: ({ row }) => (
            <Checkbox
              isChecked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
        }),
        columnHelper.accessor("name", {
          cell: (info) => info.getValue(),
          header: t("global.name"),
        }),
        columnHelper.accessor("tags", {
          cell: ({ row }) => (
            <Wrap w='200px'>
              {row.original.tags.map((tag) => (
                <WrapItem key={tag}>
                  <Badge colorScheme='blue'>{tag}</Badge>
                </WrapItem>
              ))}
            </Wrap>
          ),
          header: t("global.tags"),
        }),
      ];

      if (
        collection?.optionalItemFields &&
        collection.optionalItemFields.length
      ) {
        const parsedOptionalItemFields = JSON.parse(
          collection.optionalItemFields
        );

        const dynamicColumns = parsedOptionalItemFields.map((field) =>
          columnHelper.accessor(field.name, {
            cell: (info) => (
              <div
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {info.getValue()}
              </div>
            ),
            header: field.name,
          })
        );

        _columns.splice(2, 0, ...dynamicColumns);
      }
      setColumns(_columns);
    }
  }, [collection, i18n.resolvedLanguage]);

  return (
    <Box mt={5}>
      <Stack
        spacing={1}
        direction={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        alignItems={{ base: "flex-start", md: "center" }}
        mb={3}
      >
        <Heading fontSize={"lg"} my={3}>
          {t("global.collectionItems")}
        </Heading>
        <Wrap>
          <Button
            leftIcon={<AddIcon />}
            colorScheme='linkedin'
            onClick={openCreateModal}
          >
            {t("global.newItem")}
          </Button>
          <Button
            leftIcon={<EditIcon />}
            isDisabled={!selectedItemId}
            colorScheme='gray'
            onClick={openEditModal}
          >
            {t("global.edit")}
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            isDisabled={!selectedItemId}
            colorScheme='red'
            onClick={openDeleteModal}
          >
            {t("global.delete")}
          </Button>
        </Wrap>
      </Stack>
      <ReactTable
        columns={columns}
        data={data}
        onRowSelect={setSelectedRow}
        selectedRow={selectedRow}
        getRowId={getRowId}
      />

      {isCreateModalOpen && (
        <CreateItemModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          optionalItemFields={
            collection?.optionalItemFields &&
            JSON.parse(collection.optionalItemFields)
          }
          collection={collection}
          setCollection={setCollection}
        />
      )}
      {isEditModalOpen && (
        <ItemEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          optionalItemFields={
            collection?.optionalItemFields &&
            JSON.parse(collection.optionalItemFields)
          }
          collection={collection}
          setCollection={setCollection}
          selectedItemId={selectedItemId}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => deleteItem(selectedItemId)}
          isLoading={deletingItem}
          modalTitle={t("global.deleteItem")}
        />
      )}
    </Box>
  );
};

export default ItemsTable;
