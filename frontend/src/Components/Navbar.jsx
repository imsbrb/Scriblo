import { Link, useNavigate } from "react-router";
import { PlusIcon } from "lucide-react";
import { isLoggedIn, logout } from "../lib/utils";



const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // clears token and redirects to /login
    };

    return (
        <header className="bg-base-300 border-b border-base-content/10">
            <div className="mx-auto max-w-6xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">Scriblo</h1>

                    <div className="flex items-center gap-4">
                        {isLoggedIn() ? (
                            <>
                                <Link to={"/create"} className="btn btn-primary">
                                    <PlusIcon className="size-5" />
                                    <span>New Note</span>
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-outline">
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;