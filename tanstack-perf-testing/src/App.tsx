import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import ItemsTable from "./ItemsTable";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ItemsTable />
    </QueryClientProvider>
  );
}

export default App;
