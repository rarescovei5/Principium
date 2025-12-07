import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DiscoverPage from './pages/DiscoverPage';
import DownloadPage from './pages/DownloadPage';
import LibraryPage from './pages/LibraryPage';
import AppPage from './pages/AppPage';


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/app/:appId" element={<AppPage />} />
          <Route path="/downloads" element={<DownloadPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
