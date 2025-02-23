import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Provider } from "react-redux";

import App from "./App.jsx";
import theme from "./theme.js";
import { store } from "./store";
import AuthProvider from "./context/Auth.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Provider store={store}>
              <React.Suspense fallback='Loading...'>
                <App />
              </React.Suspense>
            </Provider>
          </AuthProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </React.StrictMode>
  </>
);
