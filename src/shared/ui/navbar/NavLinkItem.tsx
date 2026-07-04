import { NavLink } from "react-router";
import type { NavItem } from "./navbar.types";

interface NavLinkItemProps {
    item: NavItem;
}
export default function NavLinkItem({ item }: NavLinkItemProps) {
    return (
        <NavLink to={item.href} className="group relative inline-flex flex-col items-center py-2">
            {({ isActive }) => (
                <>
                    <span className="relative inline-block text-sm">
                        {/* Invisible bold ghost: reserves the width so nothing shifts */}
                        <span aria-hidden="true" className="invisible block font-bold">
                            {item.label}
                        </span>
                        <span
                            className={`absolute inset-0 whitespace-nowrap transition-colors duration-150 ${isActive
                                    ? 'font-bold text-neutral-900'
                                    : 'font-normal text-neutral-700 group-hover:font-bold group-hover:text-neutral-900'
                                }`}
                        >
                            {item.label}
                        </span>
                    </span>

                    {/* The black underline bar, animated with a scale transform
                    (cheaper for the browser than animating width). */}
                    <span
                        className={`absolute -bottom-0.5 h-0.5 w-full origin-left bg-neutral-900 transition-transform duration-200 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                            }`}
                    />
                </>
            )}
        </NavLink>
    );
}