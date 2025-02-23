import {
  Heading,
  Card,
  CardBody,
  Image,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const CollectionCard = ({
  id,
  title,
  imageUrl,
  description,
  authorName,
  items,
}) => {
  return (
    <Card boxShadow={"md"} border={"1px solid lightgray"}>
      <CardBody>
        <Image
          src={imageUrl ?? "https://picsum.photos/seed/picsum/200?blur"}
          alt='Green double couch with wooden legs'
          borderRadius='lg'
          height={"180px"}
          width={"100%"}
        />
        <Stack mt={6} spacing={4}>
          <Heading as={"h3"} size='md'>
            {title}
          </Heading>
          <Text noOfLines={2}>
            {description}. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Enim, doloribus.
          </Text>
          <Stack spacing={1}>
            <Text>
              Author: <b>{authorName}</b>
            </Text>
            <Text>
              Items: <b>{items}</b>
            </Text>
          </Stack>
          <Button variant={"outline"} as={Link} to={`collections/${id}`}>
            View
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default CollectionCard;
