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
                    {userDisplayName ? (
                        <>
                            <p className="mb-4 text-sm text-neutral-700">
                                Connecté{userDisplayName ? ` en tant que ${userDisplayName}` : ''}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                                className="w-full rounded-md bg-amber-400 py-3 text-sm font-medium text-neutral-900 hover:bg-amber-500 cursor-pointer"
                            >
                                Se déconnecter
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="mb-1 text-base font-semibold text-neutral-900">Bienvenue</p>
                            <p className="mb-4 text-sm text-neutral-600">
                                Connectez-vous ou inscrivez-vous pour accéder à votre fidélité, vos offres, etc.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                }}
                                className="mb-3 w-full rounded-md bg-amber-400 py-3 text-sm font-medium text-neutral-900 hover:bg-amber-500"
                            >
                                Connexion
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                }}
                                className="w-full rounded-md border border-neutral-300 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                            >
                                Inscription
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
