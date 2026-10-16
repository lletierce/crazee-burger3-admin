import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "./PasswordInput";

function renderInput(props: Partial<React.ComponentProps<typeof PasswordInput>> = {}) {
    render(<PasswordInput placeholder="Mot de passe" defaultValue="secret123" {...props} />);
    return {
        input: screen.getByPlaceholderText("Mot de passe"),
        toggle: screen.getByRole("button"),
    };
}

describe("PasswordInput", () => {
    it("masque le mot de passe par défaut", () => {
        const { input, toggle } = renderInput();

        expect(input).toHaveAttribute("type", "password");
        expect(toggle).toHaveAccessibleName("Afficher le mot de passe");
        expect(toggle).toHaveAttribute("aria-pressed", "false");
    });

    it("affiche puis masque le mot de passe au clic", async () => {
        const user = userEvent.setup();
        const { input, toggle } = renderInput();

        await user.click(toggle);
        expect(input).toHaveAttribute("type", "text");
        expect(toggle).toHaveAccessibleName("Masquer le mot de passe");
        expect(toggle).toHaveAttribute("aria-pressed", "true");

        await user.click(toggle);
        expect(input).toHaveAttribute("type", "password");
        expect(toggle).toHaveAccessibleName("Afficher le mot de passe");
    });

    it("ne soumet pas le formulaire parent", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
        render(
            <form onSubmit={onSubmit}>
                <PasswordInput placeholder="Mot de passe" />
            </form>,
        );

        await user.click(screen.getByRole("button", { name: "Afficher le mot de passe" }));

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("transmet les props à l'input et conserve la saisie", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { input, toggle } = renderInput({ defaultValue: undefined, onChange, required: true });

        await user.type(input, "abc");
        await user.click(toggle);

        expect(onChange).toHaveBeenCalledTimes(3);
        expect(input).toBeRequired();
        expect(input).toHaveValue("abc");
    });
});
