import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MinimalistActionBtn from "./MinimalistActionBtn";

describe("MinimalistActionBtn", () => {
    it("affiche le libellé comme nom accessible, sans lire l'icône", () => {
        render(<MinimalistActionBtn label="Retour" icon={<svg data-testid="icon" />} />);

        expect(screen.getByRole("button", { name: "Retour" })).toBeInTheDocument();
        expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
    });

    it("appelle onClick au clic", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<MinimalistActionBtn label="Retour" onClick={onClick} />);

        await user.click(screen.getByRole("button", { name: "Retour" }));

        expect(onClick).toHaveBeenCalledOnce();
    });

    it("ne soumet pas le formulaire parent (type=button par défaut)", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
        render(
            <form onSubmit={onSubmit}>
                <MinimalistActionBtn label="Retour" />
            </form>,
        );

        await user.click(screen.getByRole("button", { name: "Retour" }));

        expect(screen.getByRole("button")).toHaveAttribute("type", "button");
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("ajoute la className du parent aux classes de base", () => {
        render(<MinimalistActionBtn label="Retour" className="absolute left-4" />);

        expect(screen.getByRole("button")).toHaveClass("absolute", "left-4", "inline-flex");
    });
});
