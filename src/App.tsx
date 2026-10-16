import { BrowserRouter, Link, Route, Routes } from "react-router";
import { SceneDisplayPage } from "./pages/SceneDisplayPage";
import { SceneEditPage } from "./pages/SceneEditPage";
import { SceneListPage } from "./pages/SceneListPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <Link to="/" className="app-title">
            Daggerheart GM Tools
          </Link>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<SceneListPage />} />
            <Route path="/scenes/new/:type" element={<SceneEditPage />} />
            <Route path="/scenes/:id/edit" element={<SceneEditPage />} />
            <Route path="/scenes/:id" element={<SceneDisplayPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
