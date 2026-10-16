import { useState, type ComponentProps } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

/**
 * Champ mot de passe avec bouton « afficher / masquer ».
 *
 * Accepte toutes les props d'un <input> (value, onChange, required, autoComplete…),
 * sauf `type`, piloté en interne.
 *
 * Accessibilité :
 * - vrai <button type="button"> : focusable au clavier et ne soumet pas le formulaire ;
 * - `aria-label` décrit l'action à venir, `aria-pressed` l'état courant ;
 * - l'icône est décorative (`aria-hidden`), c'est le libellé qui est lu.
 */
type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

export default function PasswordInput({ className = "", ...inputProps }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    const Icon = isVisible ? LuEyeOff : LuEye;

    return (
        <div className="relative">
            <input
                {...inputProps}
                type={isVisible ? "text" : "password"}
                className={`w-full pr-11 ${className}`}
            />
            <button
                type="button"
                onClick={() => setIsVisible((visible) => !visible)}
                aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                aria-pressed={isVisible}
                title={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className={`
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    rounded-md
                    p-1.5
                    cursor-pointer
                    transition-colors
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-500
                    ${isVisible
                        ? "text-blue-600 hover:text-blue-700"
                        : "text-gray-400 hover:text-gray-600"}
                `}
            >
                <Icon size={18} aria-hidden="true" />
            </button>
        </div>
    );
}
