import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import History from "./pages/History";
import AuthGuard from "./components/AuthGuard";
import Question from './pages/Question';
import Layout from "./components/layout/Layout";
import Profile from './pages/Profile';
import InfoPage from './pages/InfoPage';
import InfoMaker from './pages/InfoMaker';
import News from './pages/News';
import DreamInterpreter from './pages/DreamInterpreter';
import AdmGuard from './components/AdmGuard';
import { TokenProvider } from './context/TokenProvider';
import AuthAction from './pages/AuthAction';
import { AstrologicalChart } from './pages/AstrologicalChart';

export default function App() {
    return (
        <BrowserRouter>
            <TokenProvider>
                <Layout>
                    <Routes>
                        <Route path="/__/auth/action" element={<AuthAction />} /> 
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
                            path="/astrology"
                            element={
                                <AuthGuard>
                                    <AstrologicalChart />
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
                        <Route
                            path="/dream"
                            element={
                                <AuthGuard>
                                    <DreamInterpreter />
                                </AuthGuard>
                            }
                        />
                    </Routes>
                </Layout>
            </TokenProvider>
        </BrowserRouter>
    );
}
