import { LuX } from "react-icons/lu";
import { primaryNavItems, secondaryActions } from "./navigation.config";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface MobileMenuPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenuPanel({ isOpen, onClose }: MobileMenuPanelProps) {

    useBodyScrollLock(isOpen);

    return (
        <>
            {/* Backdrop: click-outside-to-close, purely visual otherwise */}
            <div
                aria-hidden="true"
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navigation"
                className={`fixed inset-y-0 left-0 z-50 flex w-full flex-col overflow-y-auto bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="mb-8 flex items-center justify-between">
                    <div className="h-9 w-9 rounded bg-emerald-800" />
                    <button type="button" onClick={onClose} aria-label="Fermer le menu">
                        <LuX size={24} />
                    </button>
                </div>

                <ul className="flex flex-col gap-6">
                    {primaryNavItems.map((item) => (
                        <li key={item.href}>
                            <a href={item.href} onClick={onClose} className="text-base text-neutral-800">
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <hr className="my-6 border-neutral-200" />

                <ul className="flex flex-col gap-5">
                    {secondaryActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <li key={action.href}>
                                <a
                                    href={action.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 text-sm text-neutral-700"
                                >
                                    <Icon size={18} />
                                    {action.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <a
                    href="/commander"
                    onClick={onClose}
                    className="mt-8 rounded-md bg-amber-400 py-3 text-center text-sm font-medium text-neutral-900 hover:bg-amber-500"
                >
                    Commander
                </a>
            </div>
        </>
    );
}