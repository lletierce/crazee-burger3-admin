import { LuCircleUser } from "react-icons/lu";
import { primaryNavItems } from "./navigation.config";
import NavLinkItem from "./NavLinkItem";

interface DesktopNavProps {
    userDisplayName?: string;
    onLogout: () => void;
}

export default function DesktopNav({ userDisplayName, onLogout }: DesktopNavProps) {
    return (
        <div className="flex w-full items-center justify-between">
            <ul className="flex items-center gap-8">
                {primaryNavItems.map((item) => (
                    <li key={item.href}>
                        <NavLinkItem item={item} />
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-4">
                {/*
                  Même phrase que sur mobile. L'icône donne le contexte quand la
                  phrase d'introduction est masquée (tablette, manque de place).
                  Un nom très long est tronqué ; `title` l'affiche en entier au survol.
                */}
                {userDisplayName && (
                    <p className="flex min-w-0 items-center gap-2 text-sm text-neutral-600">
                        <LuCircleUser size={18} aria-hidden="true" className="shrink-0 text-neutral-500" />
                        <span className="block max-w-40 truncate lg:max-w-72">
                            <span className="hidden lg:inline">Connecté en tant que </span>
                            <span
                                title={userDisplayName}
                                className="font-semibold text-neutral-900"
                            >
                                {userDisplayName}
                            </span>
                        </span>
                    </p>
                )}

                <button
                    type="button"
                    onClick={onLogout}
                    className="shrink-0 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                >
                    Se déconnecter
                </button>
            </div>
        </div>
    );
}