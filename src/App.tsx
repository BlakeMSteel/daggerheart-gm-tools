import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router";
import Header from "./components/Header";
import { NewScenePage } from "./pages/NewScenePage";
import { PlayerFearPage } from "./pages/PlayerFearPage";
import { SceneDisplayPage } from "./pages/SceneDisplayPage";
import { SceneEditPage } from "./pages/SceneEditPage";
import { SceneListPage } from "./pages/SceneListPage";
import { ViewLayout } from "./pages/ViewLayout";
import { darkTheme, lightTheme } from "./theme";

function EditLayout() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Outlet />
    </Container>
  );
}

function Layout() {
  const { pathname } = useLocation();
  // At-the-table pages (View, and the players' Fear page) are dark with no header.
  const isTable = pathname.startsWith("/view") || pathname.startsWith("/fear");

  return (
    <ThemeProvider theme={isTable ? darkTheme : lightTheme}>
      <CssBaseline />
      {/* View mode's sidebar links back to Edit; players have no need for it. */}
      {!isTable && <Header />}
      <Routes>
        <Route path="/edit" element={<EditLayout />}>
          <Route index element={<SceneListPage />} />
          <Route path="new" element={<NewScenePage />} />
          <Route path=":id" element={<SceneEditPage />} />
        </Route>
        <Route path="/view" element={<ViewLayout />}>
          <Route
            index
            element={
              <Typography color="text.secondary">Select a scene.</Typography>
            }
          />
          <Route path=":id" element={<SceneDisplayPage />} />
        </Route>
        <Route path="/fear/:code" element={<PlayerFearPage />} />
        <Route path="*" element={<Navigate to="/edit" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
