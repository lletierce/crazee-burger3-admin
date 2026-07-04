import { primaryNavItems } from "./navigation.config";
import NavLinkItem from "./NavLinkItem";

interface DesktopNavProps {
    onLogout: () => void;
}

export default function DesktopNav({ onLogout }: DesktopNavProps) {
    return (
        <div className="flex w-full items-center justify-between">
            <ul className="flex items-center gap-8">
                {primaryNavItems.map((item) => (
                    <li key={item.href}>
                        <NavLinkItem item={item} />
                    </li>
                ))}
            </ul>

            <button
                type="button"
                onClick={onLogout}
                className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-amber-500 cursor-pointer"
            >
                Se déconnecter
            </button>
        </div>
    );
}
