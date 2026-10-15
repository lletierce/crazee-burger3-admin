import { useState } from "react";
import MinimalistActionBtn from "../buttons/MinimalistActionBtn";
import Logo from "../logos/Logo";


const BACKGROUND_SRC = "/images/burger-and-fries-background.webp";

/** GIF transparent 1×1 encodé en base64 directement : `src` de repli pour <img> quand le `media` ne correspond pas (mobile). */
const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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

    const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

    const renderTitle = () => {
        return titleVariant === "skeleton" ? (
            <div className="my-6 h-12 w-full rounded bg-gray-200 animate-pulse" />
        ) : (<h1 className="my-6 text-center font-amatic text-4xl font-bold text-gray-800">
            {title}
        </h1>)
    }

    return (
        <div className="
            relative
            min-h-screen
            flex
            justify-center
            bg-[#f5f5f7]
            md:bg-[#1c1209]
        ">
            {/* Fond décoratif (desktop) : image + voile sombre + transition */}
            <div aria-hidden="true" className="absolute inset-0 hidden overflow-hidden md:block">
                <picture className="block h-full w-full">
                    <source media="(min-width: 48rem)" srcSet={BACKGROUND_SRC} type="image/webp" />
                    <img
                        src={TRANSPARENT_PIXEL}
                        alt=""
                        fetchPriority="high"
                        decoding="async"
                        onLoad={() => setIsBackgroundLoaded(true)}
                        className={`
                            h-full
                            w-full
                            object-cover
                            transition-opacity
                            duration-700
                            motion-reduce:transition-none
                            ${isBackgroundLoaded ? "opacity-100" : "opacity-0"}
                        `}
                    />
                </picture>
                <div className="absolute inset-0 bg-black/70" />
            </div>

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