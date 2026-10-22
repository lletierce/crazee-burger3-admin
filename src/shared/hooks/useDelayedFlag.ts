import { useEffect, useState } from "react";

/**
 * Renvoie `true` seulement quand `active` est resté vrai pendant au moins
 * `delayMs` millisecondes.
 *
 * Sert à ne pas afficher d'indicateur de chargement pour une attente très
 * courte : en dessous de ~300 ms, un loader qui apparaît puis disparaît
 * aussitôt se perçoit comme un « flash », pas comme une attente. Au-delà,
 * il rassure l'utilisateur.
 *
 * Dès que `active` repasse à `false`, la valeur revient à `false` et le
 * compteur repart de zéro au prochain passage à `true`.
 */
export function useDelayedFlag(active: boolean, delayMs = 300): boolean {
    const [hasDelayElapsed, setHasDelayElapsed] = useState(false);

    useEffect(() => {
        if (!active) return;

        const timeoutId = setTimeout(() => setHasDelayElapsed(true), delayMs);

        return () => {
            clearTimeout(timeoutId);
            setHasDelayElapsed(false);
        };
    }, [active, delayMs]);

    return active && hasDelayElapsed;
}
