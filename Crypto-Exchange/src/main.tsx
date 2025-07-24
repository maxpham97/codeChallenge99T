import "./styles/main.css";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import { ErrorFallback } from "./components/ErrorFallback.tsx";

export const queryClient = new QueryClient();

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="dark">
            <ErrorBoundary fallback={<ErrorFallback />}>
                <App />
                <Toaster position="top-right" />
            </ErrorBoundary>
        </MantineProvider>
    </QueryClientProvider>
);
