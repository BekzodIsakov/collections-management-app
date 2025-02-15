import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const GoBackButton = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <Button
      onClick={() => navigate(-1)}
      variant='link'
      leftIcon={<ChevronLeftIcon boxSize={5} />}
    >
      {t("global.goBack")}
    </Button>
  );
};

export default GoBackButton;
