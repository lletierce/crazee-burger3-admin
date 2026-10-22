import { BiSolidCheckCircle, BiSolidErrorCircle } from "react-icons/bi";

type LogoVariant =
    | 'default'
    | "success"
    | "error"
    | "skeleton";

type LogoProps = {
    variant?: LogoVariant;
};

const containerClass =
    "flex items-center justify-center text-center";

const LOGO_SRC = "/images/logo-orange.png";


export default function Logo({ variant = "default" }: LogoProps) {
    switch (variant) {
        case "success":
            return (
                <div className={`${containerClass} text-green-success`}>
                    <BiSolidCheckCircle
                        className="text-8xl"
                        aria-label="Succès"
                    />
                </div>
            );

        case "error":
            return (
                <div className={`${containerClass} text-red-primary`}>
                    <BiSolidErrorCircle
                        className="text-8xl"
                        aria-label="Erreur"
                    />
                </div>
            );

        case "skeleton":
            return (
                <div className={containerClass}>
                    <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
                </div>
            );

        default:
            return (
                <div className={containerClass}>
                    <img
                        src={LOGO_SRC}
                        alt="Logo de l'application"
                        className="h-20 object-contain md:h-25"
                    />
                </div>
            );
    }
}