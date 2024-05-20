import { createMemoryRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { MqttProvider } from "./providers/MqttProvider";
import { Home } from "./routes";
import { MqttLinks } from "./routes/mqtt/links";
import { NewLink } from "./routes/mqtt/links/new";
import { MqttSettings } from "./routes/mqtt/settings";

const router = createMemoryRouter([
  { path: "/", Component: Home },
  { path: "/mqtt/settings", Component: MqttSettings },
  { path: "/mqtt/links", Component: MqttLinks },
  { path: "/mqtt/links/new", Component: NewLink },
]);

function App() {
  return (
    <main className="p-3">
      <MqttProvider>
        <RouterProvider router={router} />
      </MqttProvider>
    </main>
  );
}

export default App;
