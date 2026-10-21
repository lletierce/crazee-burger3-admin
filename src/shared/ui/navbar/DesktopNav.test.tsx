import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import DesktopNav from "./DesktopNav";

function renderNav(props: Partial<Parameters<typeof DesktopNav>[0]> = {}) {
    const onLogout = props.onLogout ?? vi.fn();
    render(
        <MemoryRouter>
            <DesktopNav onLogout={onLogout} {...props} />
        </MemoryRouter>,
    );
    return { onLogout };
}

describe("DesktopNav", () => {
    it("affiche le nom de l'utilisateur connecté", () => {
        renderNav({ userDisplayName: "jean.dupont" });

        expect(screen.getByText("jean.dupont")).toHaveAttribute("title", "jean.dupont");
        expect(screen.getByText(/Connecté en tant que/)).toBeInTheDocument();
    });

    it("n'affiche rien sur l'utilisateur si le nom est absent", () => {
        renderNav();

        expect(screen.queryByText(/Connecté en tant que/)).not.toBeInTheDocument();
    });

    it("déconnecte l'utilisateur au clic", async () => {
        const user = userEvent.setup();
        const { onLogout } = renderNav({ userDisplayName: "jean.dupont" });

        await user.click(screen.getByRole("button", { name: "Se déconnecter" }));

        expect(onLogout).toHaveBeenCalledOnce();
    });
});
