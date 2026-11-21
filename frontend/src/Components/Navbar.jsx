import { Link } from "react-router-dom";
import { HomeIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { isLoggedIn, logout } from "../lib/utils";

const Navbar = () => {
    const handleLogout = () => {
        logout(); // clears token and redirects to /login
    };

    return (
        <header className="bg-base-100 border-b-4 border-black">
            <div className="mx-auto max-w-6xl px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <Link to="/HomePage" className="font-display text-4xl leading-none">
                        Scriblo
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {isLoggedIn() ? (
                            <>
                                <Link to={"/HomePage"} className="btn btn-primary">
                                    <HomeIcon className="size-5" />
                                    <span>Home</span>
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
                                <Link to="/login" className="btn btn-outline">Login</Link>
                                <Link to="/signup" className="btn btn-outline">Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;