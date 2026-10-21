import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import NavbarBrand from "./NavbarBrand";

function renderBrand(props: Parameters<typeof NavbarBrand>[0] = {}) {
    render(
        <MemoryRouter>
            <NavbarBrand {...props} />
        </MemoryRouter>,
    );
}

describe("NavbarBrand", () => {
    it("est un lien vers la page produits, nommé par le logo", () => {
        renderBrand();

        expect(screen.getByRole("link", { name: "Crazee Burger, accueil" })).toHaveAttribute("href", "/produits");
    });

    it("affiche le nom par défaut et peut le masquer", () => {
        const { rerender } = render(
            <MemoryRouter>
                <NavbarBrand />
            </MemoryRouter>,
        );
        expect(screen.getByText("Crazee Burger")).toBeInTheDocument();

        rerender(
            <MemoryRouter>
                <NavbarBrand showName={false} />
            </MemoryRouter>,
        );
        expect(screen.queryByText("Crazee Burger")).not.toBeInTheDocument();
    });

    it("appelle onClick au clic (fermeture du menu mobile)", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        renderBrand({ onClick });

        await user.click(screen.getByRole("link"));

        expect(onClick).toHaveBeenCalledOnce();
    });
});
