import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useBootstrapAuth } from "./features/auth/useBootstrapAuth";

function App() {
  useBootstrapAuth();

  return <RouterProvider router={router} />;
}

export default App;
