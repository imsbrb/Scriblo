import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </div>
    );
};
export default App;