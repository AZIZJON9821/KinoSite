import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-lg border border-gray-800 bg-[#1a202c] text-white shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
