import { Link } from "react-router";
import { PlusIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { isLoggedIn, logout } from "../lib/utils";
const Navbar = () => {
    const handleLogout = () => {
        logout(); // clears token and redirects to /login
    };
    return (
        <header className="bg-base-300 border-b border-base-content/10">
            <div className="mx-auto max-w-6xl p-4">
                <div className="flex items-center justify-between">
                    <Link to="/HomePage" className="text-3xl font-bold text-primary font-mono tracking-tight">Scriblo</Link>
                    <div className="flex items-center gap-4">
                        {isLoggedIn() ? (
                            <>
                                <Link to={"/create"} className="btn btn-primary">
                                    <PlusIcon className="size-5" />
                                    <span>New Note</span>
                                </Link>
                                <Link to={"/shared"} className="btn btn-ghost">
                                    <UsersIcon className="size-5" />
                                    <span className="hidden sm:inline">Shared</span>
                                </Link>
                                <Link to={"/trash"} className="btn btn-ghost">
                                    <Trash2Icon className="size-5" />
                                    <span className="hidden sm:inline">Trash</span>
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