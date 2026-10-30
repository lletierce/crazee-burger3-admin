import type { ComponentProps, ReactNode } from "react";

/**
 * Bouton d'action secondaire, discret (style « ghost ») : pas de fond au repos,
 * léger fond gris au survol. Pensé pour les actions de navigation (« Retour »,
 * « Annuler »…) qui ne doivent pas concurrencer le bouton principal de la page.
 *
 * Générique : c'est le parent qui fournit le libellé, l'icône éventuelle et le
 * positionnement (via `className`). Accepte toutes les props d'un <button>.
 *
 * - `type="button"` par défaut : ne soumet jamais un formulaire par accident ;
 * - l'icône glisse légèrement au survol (désactivé si l'utilisateur
 *   a demandé à réduire les animations) ;
 * - anneau de focus orange (couleur de la marque), visible uniquement au clavier.
 */
type MinimalistActionBtnProps = Omit<ComponentProps<"button">, "children"> & {
    label: string;
    icon?: ReactNode;
};

export default function MinimalistActionBtn({
    label,
    icon,
    type = "button",
    className = "",
    ...buttonProps
}: MinimalistActionBtnProps) {
    return (
        <button
            {...buttonProps}
            type={type}
            className={`
                group
                inline-flex
                items-center
                gap-1
                rounded-lg
                py-1.5
                pl-1.5
                pr-3
                text-sm
                font-medium
                text-neutral-600
                transition-colors
                hover:bg-neutral-200/70
                hover:text-neutral-900
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary-strong
                ${className}
            `}
        >
            {icon && (
                <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none"
                >
                    {icon}
                </span>
            )}
            {label}
        </button>
    );
}