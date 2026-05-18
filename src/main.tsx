import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Routes.tsx";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";
import { Toaster } from "sonner";

import { MathProvider } from "@/components/MathProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MathProvider>
          <RouterProvider router={routes} />
        </MathProvider>
      </PersistGate>
      <Toaster richColors position="top-right" />
    </Provider>
  </StrictMode>
);
