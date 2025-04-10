import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import History from "./pages/History";
import AuthGuard from "./components/AuthGuard";
import Question from './pages/Question';
import Layout from "./components/Layout";

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
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
