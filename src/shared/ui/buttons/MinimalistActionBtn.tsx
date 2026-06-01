import { FaChevronLeft } from "react-icons/fa";

type MinimalistActionBtnProps = {
    label?: string;
    onClick?: () => void;
};


export default function MinimalistActionBtn({label, onClick} : MinimalistActionBtnProps) {
    return (
        <button 
            className='inline-flex items-center gap-0.5 bg-orange-primary  px-2 py-1 rounded-md hover:bg-red-primary transition cursor-pointer text-white' 
            onClick={onClick}>
                <span className="md:pt-0.5">
                    <FaChevronLeft />
                </span>
                <span className="text-lg md:text-xl">{label}</span>
        </button>
    )
}
