import React from "react";
import { Grid, SimpleGrid } from "@chakra-ui/react";

import CollectionCardSkeleton from "./CollectionCardSkeleton";
import CollectionCard from "./CollectionCard";

export const CollectionsGrid = ({ isLoading, collections }) => {
  return (
    <div>
      {isLoading && (
        <SimpleGrid
          templateColumns='repeat(auto-fill, minmax(240px, 1fr))'
          spacing={6}
        >
          {[1, 2, 3, 4].map((i) => (
            <CollectionCardSkeleton key={i} />
          ))}
        </SimpleGrid>
      )}

      <Grid
        templateColumns='repeat(auto-fill, minmax(240px, 1fr))'
        rowGap={8}
        columnGap={6}
      >
        {collections?.map((collection) => (
          <CollectionCard
            key={collection._id}
            id={collection._id}
            imageUrl={collection.image?.location}
            title={collection.title}
            description={collection.description}
            authorName={collection.author.name}
            items={collection.items.length}
          />
        ))}
      </Grid>
    </div>
  );
};
