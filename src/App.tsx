import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import History from "./pages/History";
import AuthGuard from "./components/AuthGuard";
import Question from './pages/Question';
import Layout from "./components/Layout";
import Profile from './pages/Profile';
import InfoPage from './pages/InfoPage';
import InfoMaker from './pages/InfoMaker';
import News from './pages/News';
import AdmGuard from './components/AdmGuard';

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/news" element={<News />} />
                    <Route
                        path="/infomaker"
                        element={
                            <AdmGuard>
                                <InfoMaker />
                            </AdmGuard>
                        }
                    />
                    <Route path="/info/:slug" element={<InfoPage />} />
                    <Route 
                        path="/"
                        element={
                            <AuthGuard>
                                <Home />
                            </AuthGuard>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/profile"
                        element={
                            <AuthGuard>
                                <Profile />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/question"
                        element={
                            <AuthGuard>
                                <Question />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/tarot"
                        element={
                            <AuthGuard>
                                <Tarot />
                            </AuthGuard>
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <AuthGuard>
                                <History />
                            </AuthGuard>
                        }
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
