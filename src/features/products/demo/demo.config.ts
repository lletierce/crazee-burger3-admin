/**
 * Mode démo : affiche le bouton « Réinitialiser » qui restaure le catalogue
 * de démonstration.
 *
 * Désactivé par défaut. Activé uniquement sur la version en ligne, via
 * `VITE_DEMO_MODE=true` au moment du build (voir .github/workflows/ci.yml).
 * Un vrai restaurant qui utiliserait ce back-office n'aurait donc jamais
 * de bouton capable d'effacer son menu.
 */
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
