export default function IconWrapper({ icon, color }: { icon: React.ReactNode; color?: string }) {
    return (
        <div
            className={`text-2xl md:text-3xl ${color} hover:scale-110 transition-transform duration-200 cursor-pointer`}
        >
            {icon}
        </div>
    )
}