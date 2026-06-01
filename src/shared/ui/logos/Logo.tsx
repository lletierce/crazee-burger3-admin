import { BiSolidCheckCircle, BiSolidErrorCircle } from "react-icons/bi";

type LogoVariant =
    | "default"
    | "success"
    | "error"
    | "skeleton";

type LogoProps = {
    variant?: LogoVariant;
};

const containerClass =
    "flex items-center justify-center text-center";

export default function Logo({
    variant = "default",
}: LogoProps) {
    switch (variant) {
        case "success":
            return (
                <div className={`${containerClass} text-green-success`}>
                    <BiSolidCheckCircle className="text-8xl" />
                </div>
            );

        case "error":
            return (
                <div className={`${containerClass} text-red-primary`}>
                    <BiSolidErrorCircle className="text-8xl" />
                </div>
            );

        case "skeleton":
            return (
                <div className={containerClass}>
                    <div className="h-24 w-32 rounded-3xl bg-gray-200 animate-pulse" />
                </div>
            );

        case "default":
        default:
            return (
                <div className={`${containerClass} pt-4`}>
                    <img
                        src="/images/logo-orange.png"
                        alt="Logo de l'application"
                        className="h-20 object-contain md:h-25"
                    />
                </div>
            );
    }
}