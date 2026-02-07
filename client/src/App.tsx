import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Simple pages for now
const HomePage = () => <div>FormFlow AI - Home</div>;
const AboutPage = () => <div>About FormFlow AI</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

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
        <Route path="/forms/:id" component={NotFound} />
        <Route path="/builder/:id" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
