import React from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  Collapse,
  HStack,
  IconButton,
  Link,
  List,
  ListItem,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { SVG, Spinner } from "@/components";
import CommentsSection from "@/components/comments-section/CommentsSection";
import { useItemFetch } from "@/hooks/items";
import { CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/Auth";
import { useFetchComments } from "@/hooks/comments";

const ItemCard = ({ itemId }) => {
  const [likeLoading, setLikeLoading] = React.useState(false);
  const toastBgColor = useColorModeValue("white", "gray.800");
  const { isOpen: isCollapsed, onToggle } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  const { fetchComments, comments, setComments } = useFetchComments();

  const { loading, item, fetchItem, updateItem } = useItemFetch();

  const { t } = useTranslation();

  const likeUnlikeItem = async (itemId) => {
    try {
      setLikeLoading(true);
      const result = await axios.patch(
        `${import.meta.env.VITE_URL}/items/${itemId}/react`
      );
      updateItem({ likes: result.data });
    } catch (error) {
      if (error.response.status === 401) {
        toast({
          render: ({ onClose }) => (
            <Box p='3' bg={toastBgColor} borderRadius='md' boxShadow='lg'>
              <HStack justify='space-between' align='center' mb='2'>
                <Text fontSize='md' fontWeight='semibold'>
                  <WarningIcon w='5' h='5' color='orange' mr='1' />{" "}
                  {t("global.unauthorized")}
                </Text>
                <IconButton size='xs' icon={<CloseIcon />} onClick={onClose} />
              </HStack>
              {t("global.please")}
              &nbsp;
              <Link href='/signin' color='blue.400'>
                {t("global.signIn")}
              </Link>
              &nbsp; {t("global.or")} &nbsp;
              <Link href='/signup' color='blue.400'>
                {t("global.signUp")}
              </Link>
            </Box>
          ),
          duration: 4000,
        });
      }
    } finally {
      setLikeLoading(false);
    }
  };

  React.useEffect(() => {
    if (itemId) fetchComments(itemId);
  }, []);

  React.useEffect(() => {
    if (itemId) {
      fetchItem(itemId);
    }
  }, [itemId]);

  if (loading) {
    return (
      <>
        <Skeleton h='64px' />
        <HStack my='1'>
          <Skeleton w='75px' h='32px' />
          <Skeleton w='97px' h='32px' />
        </HStack>
      </>
    );
  }

  if (item) {
    return (
      <>
        <Card variant='outline'>
          <CardBody p='3'>
            <List>
              <ListItem mb='2'>
                <Text as='b'>{t("global.author")}</Text>: {item.author.name}
              </ListItem>
              {item.optionalFields[0] &&
                JSON.parse(item.optionalFields).map((field, index) => (
                  <ListItem key={index} mb='2'>
                    <Text as='b' textTransform={"capitalize"}>
                      {field.name}
                    </Text>
                    : {String(field.value)}
                  </ListItem>
                ))}
            </List>
          </CardBody>
        </Card>

        <HStack my='1' spacing='5'>
          <Button
            isDisabled={likeLoading}
            onClick={() => likeUnlikeItem(item._id)}
            variant='ghost'
            size='sm'
          >
            {item.likes.includes(user?.id) ? (
              <SVG iconId='like-solid' />
            ) : (
              <SVG iconId='like' />
            )}
            <Text ml='1'>{t("global.like")}</Text>
            <Text
              color='blue.400'
              fontSize='sm'
              ml={item.likes.length ? "2" : "0"}
            >
              {likeLoading ? (
                <Spinner size='xs' />
              ) : item.likes.length ? (
                item.likes.length
              ) : null}
            </Text>
          </Button>
          <Button size='sm' variant='ghost' onClick={onToggle}>
            {isCollapsed ? (
              <SVG iconId='comments-solid' />
            ) : (
              <SVG iconId='comments' />
            )}
            <Text ml='1'>{t("global.comments")}</Text>
          </Button>
        </HStack>

        <Collapse in={isCollapsed} animateOpacity>
          {isCollapsed && (
            <CommentsSection
              itemId={itemId}
              comments={comments}
              setComments={setComments}
            />
          )}
        </Collapse>
      </>
    );
  }
};

export default ItemCard;
