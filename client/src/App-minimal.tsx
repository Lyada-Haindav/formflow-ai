import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Simple pages for now
const HomePage = () => <div>FormFlow AI - Home</div>;
const AboutPage = () => <div>About FormFlow AI</div>;

function App() {
  const { user, isLoading } = { user: null, isLoading: false };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
