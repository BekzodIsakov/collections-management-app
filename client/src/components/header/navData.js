import React from "react";
import { useAuth } from "../../context/Auth";
import { useTranslation } from "react-i18next";

export const useNavData = () => {
  const [navData, setNavData] = React.useState([]);

  const { t, i18n } = useTranslation();
  const { token, user } = useAuth();

  React.useEffect(() => {
    const publicNavLinks = [
      { label: t("nav.mainPage"), to: "/" },
      { label: t("nav.aboutPage"), to: "/about" },
    ];
    const authenticatedNavLinks = [{ label: t("nav.profile"), to: "/profile" }];
    const adminNavLinks = [{ label: t("nav.usersPage"), to: "users" }];

    const navLinks = [...publicNavLinks];
    if (token) {
      navLinks.push(...authenticatedNavLinks);

      if (user.isAdmin) {
        navLinks.push(adminNavLinks);
      }
    }
    setNavData(navLinks);
  }, [user, token, t, i18n.resolvedLanguage]);

  return {
    navData,
    setNavData,
  };
};
