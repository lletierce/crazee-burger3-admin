import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'


// S'exécute avant chaque fichier de test. 
// Il active les vérifications de jest-dom et nettoie l'affichage entre deux tests.
afterEach(() => {
  cleanup()
})