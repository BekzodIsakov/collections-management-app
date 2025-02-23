import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { useAuth } from "../context/Auth";
import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ParentRoute from "./ParentRoute";
import MainPage from "../pages/main-page/MainPage";
import CollectionView from "../pages/collection-page/CollectionView";
import CollectionManagementPage from "../pages/CollectionManagementPage";
import NotFoundPage from "../pages/NotFoundPage";
import UsersPage from "../pages/UsersPage";
import UserPage from "../pages/UserPage";
import CurrentUserProvider from "../context/currentUserProvider";
import ItemPage from "../pages/ItemPage";
import AboutPage from "../pages/AboutPage";

const Routes = () => {
  const { token, user } = useAuth();

  const routesForAuthenticated = [
    {
      path: "/",
      element: (
        <CurrentUserProvider>
          <ProtectedRoute />
        </CurrentUserProvider>
      ),
      children: [
        {
          path: "/profile",
          element: <UserPage />,
        },
        {
          path: "/profile/collections/:collectionId",
          element: <CollectionManagementPage />,
        },
      ],
    },
  ];

  const routesForAdmins = [
    {
      path: "/",
      element: (
        <CurrentUserProvider>
          <ProtectedRoute />
        </CurrentUserProvider>
      ),
      children: [
        {
          path: "/admin/:id",
          element: <div>admin page</div>,
        },
        {
          path: "/users",
          element: <UsersPage />,
        },
        {
          path: "/users/:userId",
          element: <UserPage />,
        },
        {
          path: "/users/:userId/collections/:collectionId",
          element: <CollectionManagementPage />,
        },
      ],
    },
  ];

  const routes = [
    {
      path: "/",
      element: <ParentRoute />,
      children: [
        { path: "/", element: <MainPage /> },
        { path: "/about", element: <AboutPage /> },
        { path: "/collections/:collectionId", element: <CollectionView /> },
        { path: "/items/:itemId", element: <ItemPage /> },
        ...(token ? routesForAuthenticated : []),
        ...(token && user.isAdmin ? routesForAdmins : []),
      ],
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ];

  const router = createBrowserRouter([...routes]);

  return <RouterProvider router={router} />;
};

export default Routes;
