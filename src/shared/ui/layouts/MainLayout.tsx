import type { ReactNode } from "react";
import Navbar, { type NavbarProps } from "../navbar/Navbar";
import AppFrame from "./AppFrame";

interface MainLayoutProps extends NavbarProps {
    children: ReactNode;
}

export default function MainLayout({ children, ...navbarProps }: MainLayoutProps) {
    return (
        <AppFrame>
            <Navbar {...navbarProps} />
            <div>{children}</div>
        </AppFrame>
    );
}