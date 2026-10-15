import { useState } from "react";

/**
 * Fond décoratif plein écran (desktop uniquement) : photo + voile sombre.
 * 
 * Partagé par AuthLayout et MainLayout pour ne pas dupliquer la logique.
 * 
 * Le fond est placé en `fixed` pour qu'il reste visible même si le contenu de la page dépasse la hauteur de l'écran.
 * 
 * Le parent doit placer son contenu en `relative` pour qu'il passe au-dessus du fond.
 */
const BACKGROUND_SRC = "/images/burger-and-fries-background.webp";

/** GIF transparent 1×1 : `src` de repli pour <img> quand le `media` ne correspond pas (mobile). */
const TRANSPARENT_PIXEL =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function PageBackground() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div aria-hidden="true" className="fixed inset-0 hidden overflow-hidden bg-[#1c1209] md:block">
            <picture className="block h-full w-full">
                <source media="(min-width: 48rem)" srcSet={BACKGROUND_SRC} type="image/webp" />
                <img
                    src={TRANSPARENT_PIXEL}
                    alt=""
                    fetchPriority="high"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={`
                        h-full
                        w-full
                        object-cover
                        transition-opacity
                        duration-700
                        motion-reduce:transition-none
                        ${isLoaded ? "opacity-100" : "opacity-0"}
                    `}
                />
            </picture>
            <div className="absolute inset-0 bg-black/70" />
        </div>
    );
}
