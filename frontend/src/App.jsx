import { Route, Routes, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { isLoggedIn } from "./lib/utils";
import Navbar from "./Components/Navbar";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";
    return (
        <>
            {!hideNavbar && <Navbar />}
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/HomePage" element={isLoggedIn() ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/create" element={isLoggedIn() ? <CreatePage /> : <Navigate to="/login" />} />
                    <Route path="/note/:id" element={isLoggedIn() ? <NoteDetailPage /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </>
    );
};
export default App;