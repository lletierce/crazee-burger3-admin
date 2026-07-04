import { LuMenu, LuUser, LuX } from "react-icons/lu";
import { useNavbarState } from "./hooks/useNavbarState";
import DesktopNav from "./DesktopNav";
import MobileMenuPanel from "./MobileMenuPanel";
import MobileUserPanel from "./MobileUserPanel";

export interface NavbarProps {
    userDisplayName?: string;
    onLogout: () => void;
}

export default function Navbar( { userDisplayName, onLogout }: NavbarProps ) {

    const { isMenuOpen, isUserOpen, toggleMenu, toggleUser, closeAll } = useNavbarState();

    return (
        <header className="relative z-50 border-b border-neutral-200 bg-white md:rounded-t-2xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
                {/* --- Mobile layout: hamburger | logo | user icon --- */}
                <div className="grid w-full grid-cols-3 items-center md:hidden">
                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        >
                            {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <div className="h-9 w-9 rounded bg-emerald-800" />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={toggleUser}
                            aria-expanded={isUserOpen}
                            aria-label={isUserOpen ? 'Fermer le panneau utilisateur' : 'Ouvrir le panneau utilisateur'}
                        >
                            {isUserOpen ? <LuX size={24} /> : <LuUser size={24} />}
                        </button>
                    </div>
                </div>

                {/* --- Desktop layout: logo | links | logout --- */}
                <div className="hidden w-full items-center md:flex" >
                    <div className="mr-8 h-9 w-9 shrink-0 rounded bg-emerald-800" />
                    <DesktopNav onLogout={onLogout} />
                </div>
            </div>

            <MobileMenuPanel isOpen={isMenuOpen} onClose={closeAll} />
            <MobileUserPanel
                isOpen={isUserOpen}
                onClose={closeAll}
                userDisplayName={userDisplayName}
                onLogout={onLogout}
            />
        </header>
    );
}
