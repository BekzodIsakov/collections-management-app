import { Heading, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { CollectionsGrid } from "./components/CollectionsGrid";
import { fetchCollections } from "../../utils/data";

const MainPage = () => {
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(),
    refetchOnWindowFocus: false, // remove this line for deployment
    refetchInterval: 2000 * 60,
  });

  const { t } = useTranslation();

  const collections = data?.data;

  return (
    <Stack direction={"column"} spacing={24}>
      <section>
        <Heading as='h1' fontSize='4xl' marginBottom={8}>
          {t("main.collections")}
          {isFetching && <Spinner marginLeft={6} />}
        </Heading>
        <CollectionsGrid isLoading={isLoading} collections={collections} />
      </section>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aperiam
        asperiores illo corporis, modi magni nihil animi quisquam praesentium
        ratione.
      </div>
    </Stack>
  );
};

export default MainPage;
