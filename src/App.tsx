import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/Header";
import { SceneDisplayPage } from "./pages/SceneDisplayPage";
import { SceneEditPage } from "./pages/SceneEditPage";
import { SceneListPage } from "./pages/SceneListPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<SceneListPage />} />
          <Route path="/scenes/new/:type" element={<SceneEditPage />} />
          <Route path="/scenes/:id/edit" element={<SceneEditPage />} />
          <Route path="/scenes/:id" element={<SceneDisplayPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
