import type { ReactNode } from "react";
import Navbar, { type NavbarProps } from "../navbar/Navbar";

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
            md:p-6
            md:bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/images/burger-and-fries-background.jpg')]
            md:bg-cover 
            md:bg-center"
        >
            <div className="
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