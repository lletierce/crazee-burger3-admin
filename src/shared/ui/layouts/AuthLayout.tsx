import MinimalistActionBtn from "../buttons/MinimalistActionBtn";
import Logo from "../logos/Logo";
import PageBackground from "./PageBackground";


type AuthLayoutProps = {
    children: React.ReactNode;
    title?: string;
    titleVariant?: "default" | "skeleton";
    logoVariant?: "default" | "success" | "error" | "skeleton";

    actionButton?: {
        label: string;
        onClick: () => void;
    };

};

export default function AuthLayout({
    children,
    title = 'Connexion',
    titleVariant = "default",
    logoVariant = "default",
    actionButton,

}: AuthLayoutProps) {

    const renderTitle = () => {
        return titleVariant === "skeleton" ? (
            <div className="my-6 h-12 w-full rounded bg-gray-200 animate-pulse" />
        ) : (<h1 className="my-6 text-center font-amatic text-4xl font-bold text-gray-800">
            {title}
        </h1>)
    }

    return (
        <div className="
            min-h-screen
            flex
            justify-center
            bg-[#f5f5f7]
        ">
            {/* Fond décoratif (desktop) */}
            <PageBackground />

            <div className="
                relative
                w-full
                max-w-md
                bg-[#f5f5f7]
                p-8
                shadow-xl
                md:mt-36
                md:h-min
                md:rounded-2xl
            ">
                {/* Bouton optionnel */}
                {actionButton && (
                    <MinimalistActionBtn
                        label={actionButton.label}
                        onClick={actionButton.onClick}
                    />
                )}

                {/* Logo */}
                <Logo variant={logoVariant} />

                {/* Titre */}
                {renderTitle()}

                {/* Contenu de la page */}
                {/* Le composant enfant n'attend pas l'image : il est utilisable immédiatement. */}
                {children}
            </div>
        </div>
    )
}