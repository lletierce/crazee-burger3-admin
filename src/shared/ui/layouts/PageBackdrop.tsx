import PageBackground from "./PageBackground";

interface PageBackdropProps {
    /** Couleur de fond sur mobile, à aligner sur la page qui va s'afficher. */
    className?: string;
}

/**
 * Écran volontairement « vide » : uniquement le fond de l'application.
 *
 * Affiché pendant les toutes premières millisecondes d'une attente, avant que
 * le skeleton n'apparaisse (voir useDelayedFlag). Si l'attente est courte,
 * l'utilisateur ne voit que le fond, puis directement la page : aucun loader
 * qui clignote. Le fond étant le même que celui des pages, rien ne saute.
 */
export default function PageBackdrop({ className = "bg-neutral-50" }: PageBackdropProps) {
    return (
        <div aria-busy="true" className={`min-h-screen ${className}`}>
            <PageBackground />
        </div>
    );
}
