import {
  Avatar,
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "@/providers/authProvider";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import moment from "moment";
import React from "react";
import Compose from "./Compose";
import { socket } from "@/socket";

const Comment = ({
  src,
  name,
  commentId,
  comment,
  authorId,
  date,
  setComments,
  comments,
  likes,
}) => {
  const { user } = useAuth();

  const bgColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("blackAlpha.700", "gray.200");

  const [content, setContent] = React.useState(comment);
  const [editMode, setEditMode] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [likeUnlikeLoading, setLikeUnlikeLoading] = React.useState(false);

  const today = new Date();

  function handleEditComment() {
    setEditing(true);
    socket.emit("editComment", { commentId, content }, () => {
      setEditing(false);
      setEditMode(false);
    });
  }

  function handleDeleteComment() {
    setDeleting(true);
    socket.emit("deleteComment", commentId, () => {
      setDeleting(false);
      const _comments = comments.filter((c) => c._id !== commentId);
      setComments(_comments);
    });
  }

  function likeUnlikeItem() {
    setLikeUnlikeLoading(true);
    socket.emit("likeUnlikeItem", { commentId, userId: user.id }, () => {
      setLikeUnlikeLoading(false);
    });
  }

  React.useEffect(() => {
    setContent(comment);
  }, [comment]);

  return (
    <HStack alignItems='flex-start'>
      <Avatar src={src} size='sm' name={name} />
      <VStack alignItems='flex-start' spacing='0' flexGrow='1'>
        <VStack
          spacing='0'
          bg={bgColor}
          rounded='2xl'
          px={editMode ? "0" : "3"}
          py={editMode ? "0" : "2"}
          alignItems='flex-start'
          fontSize='sm'
          width='100%'
        >
          {editMode ? (
            <Compose
              name={name}
              comment={content}
              setComment={setContent}
              onSend={handleEditComment}
              loading={editing}
              editMode={editMode}
              turnOffEditMode={() => setEditMode(false)}
            />
          ) : (
            <>
              <Text as='b' fontWeight='semibold' mb='0.5'>
                {name}
              </Text>
              <Box lineHeight='1.4'>{content}</Box>
            </>
          )}
        </VStack>
        <HStack spacing='3' ml='2' mt='1'>
          <Button
            isDisabled={likeUnlikeLoading}
            variant='unstyled'
            fontSize='xs'
            fontWeight='bold'
            color={likes.includes(user?.id) ? "blue.400" : textColor}
            height='max-content'
            minWidth='max-content'
            onClick={likeUnlikeItem}
          >
            Like {likes?.length > 0 ? likes.length : null}
          </Button>
          <Button
            variant='unstyled'
            fontSize='xs'
            fontWeight='bold'
            color={textColor}
            height='max-content'
            minWidth='max-content'
          >
            Reply
          </Button>
          {authorId === user?.id && (
            <HStack spacing={4} ml={3}>
              <Button
                variant='unstyled'
                fontSize='xs'
                fontWeight='bold'
                color={textColor}
                height='max-content'
                minWidth='max-content'
                leftIcon={<EditIcon />}
                iconSpacing={1}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
              <Popover>
                {({ onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Button
                        variant='unstyled'
                        fontSize='xs'
                        fontWeight='bold'
                        color={textColor}
                        height='max-content'
                        minWidth='max-content'
                        leftIcon={<DeleteIcon />}
                        iconSpacing={1}
                      >
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent width='var(--chakra-sizes-3xs)'>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>
                        <Text color='red'>Delete comment</Text>
                      </PopoverHeader>
                      <PopoverBody>
                        <Button size='xs' mr='3' onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme='red'
                          size='xs'
                          isLoading={deleting}
                          onClick={handleDeleteComment}
                        >
                          Delete
                        </Button>
                      </PopoverBody>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            </HStack>
          )}
          <Text fontSize='xs' color='gray.500' fontWeight='medium'>
            {moment(date).from(moment(today), true)}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default Comment;
