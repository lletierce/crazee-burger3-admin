import type { ReactNode } from "react";
import Navbar, { type NavbarProps } from "../navbar/Navbar";
import PageBackground from "./PageBackground";

interface MainLayoutProps extends NavbarProps {
    children: ReactNode;
}

export default function MainLayout({ children, ...navbarProps }: MainLayoutProps) {
    return (
        <div className="
            min-h-screen
            bg-neutral-50
            md:flex
            md:items-center
            md:justify-center
            md:overflow-y-auto
            md:p-6"
        >
            {/* Fond décoratif (desktop) */}
            <PageBackground />

            <div className="
                relative
                w-full
                md:max-w-6xl
                md:overflow-hidden
                md:rounded-2xl
                md:bg-white
                md:shadow-[inset_0_-24px_24px_-24px_rgba(0,0,0,0.5)]"
            >
                <Navbar {...navbarProps} />
                <div>{children}</div>
            </div>
        </div>
    );
}