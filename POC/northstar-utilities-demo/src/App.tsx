import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DemoPage } from "./pages/DemoPage";
import { demoRoutes } from "./data/demoRoutes";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        {demoRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<DemoPage route={route} />}
          />
        ))}
      </Routes>
    </AppShell>
  );
}
