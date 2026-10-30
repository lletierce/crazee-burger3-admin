interface MobileUserPanelProps {
    isOpen: boolean;
    onClose: () => void;
    userDisplayName?: string;
    onLogout: () => void;
}

export default function MobileUserPanel({ isOpen, onClose, userDisplayName, onLogout }: MobileUserPanelProps) {
    return (
        <div
            className={`absolute inset-x-0 top-full z-40 grid bg-white shadow-md transition-[grid-template-rows] duration-300 ease-in-out md:hidden ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
        >
            <div className="overflow-hidden">
                <div className="p-6">
                    {userDisplayName && (
                        <p className="mb-4 truncate text-sm text-neutral-600">
                            Connecté en tant que{' '}
                            <span className="font-semibold text-neutral-900">{userDisplayName}</span>
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            onLogout();
                            onClose();
                        }}
                        className="w-full rounded-md border border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}