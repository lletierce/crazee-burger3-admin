import type { ReactNode } from "react";
import PageBackground from "./PageBackground";

interface AppFrameProps {
    children: ReactNode;
}

/**
 * Cadre visuel des pages de l'application connectée : fond (photo sur desktop)
 * et carte blanche centrée. Ne contient ni navbar ni logique.
 *
 * Extrait de MainLayout pour être partagé avec l'écran d'attente
 * (AuthenticatedLayoutSkeleton) : les deux affichent exactement le même cadre,
 * donc le passage de l'un à l'autre ne fait rien « sauter » à l'écran.
 */
export default function AppFrame({ children }: AppFrameProps) {
    return (
        <div className="
            min-h-screen
            bg-neutral-50
            md:flex
            md:items-center
            md:justify-center
            md:overflow-y-auto
            md:p-6"
        >
            {/* Fond décoratif (desktop) */}
            <PageBackground />

            <div className="
                relative
                w-full
                md:max-w-6xl
                md:overflow-hidden
                md:rounded-2xl
                md:bg-white
                md:shadow-[inset_0_-24px_24px_-24px_rgba(0,0,0,0.5)]"
            >
                {children}
            </div>
        </div>
    );
}
