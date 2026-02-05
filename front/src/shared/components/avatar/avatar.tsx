import { ReactElement, type PropsWithChildren } from "react"
type shape = "circle" | "rounded" | "masked"
type mask = "none" | "decagon" | "hexagon" | "heart"
type variant = "solid" | "soft" | "outline"
type badge = "top" | "bottom"
type status = "online" | "away" | "busy" | "offline"
type group = "basic" | "pullup"
type size = "6" | "10" | "14" | "16"
type color = "primary" | "secondary" | "info" | "success" | "warning" | "error"
interface AvatarProps {
    shape?: shape;
    mask?: mask;
    variant?: variant;
    badge?: badge;
    status?: status;
    group?: group;
    iconUrl?: string;
    logo?: string;
    size?: size;
    color?: color;
    initials?: string;
}
export default function Avatar({
    shape = "circle",
    variant = "soft",
    badge = "top",
    status = "online",
    group = "basic",
    iconUrl = "",
    size = "10",
    mask = "none",
    color = "primary",
    initials = ""
}: PropsWithChildren<AvatarProps>): ReactElement {
    const groups: Record<group, string> = {
        basic: "",
        pullup: ""
    }
    const sizes: Record<size, string> = {
        6: "size-6",
        10: "size-10",
        14: "size-14",
        16: "size-16"
    }
    const statuses: Record<status, string> = {
        online: "online",
        offline: "offline",
        away: "away",
        busy: "busy"
    }
    const colors: Record<color, string> = {
        primary: "primary",
        secondary: "secondary",
        info: "info",
        success: "success",
        warning: "warning",
        error: "error",
    }
    const badges: Record<badge, string> = {
        top: `avatar-${statuses[status]}-top`,
        bottom: `avatar-${statuses[status]}-bottom`
    }
    const IconsSizes: Record<size, string> = {
        6: "w-6",
        10: "w-10",
        14: "w-14",
        16: "w-16"
    }
    const IconsTextSizes: Record<size, string> = {
        6: "text-xs",
        10: "text-md",
        14: "text-xl",
        16: "text-2xl"
    }
    const variants: Record<variant, string> = {
        solid: `bg-${colors[color]} text-${colors[color]}-content w-${IconsSizes[size]}`,
        soft: `bg-${colors[color]}/10 text-${colors[color]} w-${IconsSizes[size]}`,
        outline: `border-${colors[color]} text-${colors[color]} border w-${IconsSizes[size]}`
    }
    const shapes: Record<shape, string> = {
        circle: "rounded-full",
        rounded: "rounded-md",
        masked: "mask"
    }
    const masks: Record<mask, string> = {
        none: "",
        decagon: "mask mask-decagon",
        hexagon: "mask mask-hexagon-2",
        heart: "mask mask-heart",
    }
    return (
        <div className={`avatar ${initials && "avatar-placeholder"}`}>
            <div className={`${sizes[size]} ${groups[group]} ${badges[badge]} ${variants[variant]} ${shapes[shape]} ${masks[mask]}`}>
                {iconUrl ? <img src={iconUrl} alt={initials} /> : <span className={`${IconsTextSizes[size]} uppercase`}>{initials}</span>}
            </div>
        </div >
    )
}