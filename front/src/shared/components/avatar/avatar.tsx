import { ReactElement, ReactNode, type PropsWithChildren } from "react"
type shape = "circle" | "rounded" | "masked"
type mask = "none" | "decagon" | "hexagon" | "heart"
type variant = "solid" | "soft" | "outline"
type badge = "none" | "top" | "bottom"
type status = "none" | "online" | "away" | "busy" | "offline"
type group = "basic" | "pullup"
type size = "6" | "10" | "14" | "16"
type color = "primary" | "secondary" | "info" | "success" | "warning" | "error"
type isChat = true | false
interface AvatarProps {
    shape?: shape;
    mask?: mask;
    variant?: variant;
    badge?: badge;
    status?: status;
    group?: group;
    iconUrl?: string;
    logoIndicator?: ReactNode;
    size?: size;
    color?: color;
    initials?: string;
    isChat: isChat
}
export default function Avatar({
    shape = "circle",
    variant = "soft",
    badge = "none",
    status = "none",
    group = "basic",
    iconUrl = "",
    size = "10",
    mask = "none",
    color = "primary",
    initials = "",
    logoIndicator,
    isChat = false
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
        none: "",
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
        none: "",
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
        solid: `bg-${colors[color]} text-${colors[color]}-content ${IconsSizes[size]}`,
        soft: `bg-${colors[color]}/10 text-${colors[color]} ${IconsSizes[size]}`,
        outline: `border-${colors[color]} text-${colors[color]} border ${IconsSizes[size]}`
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
    if (isChat) {
        return (
            <div className="chat-avatar avatar">
                <div className="size-10 rounded-full">
                    {iconUrl ? <img src={iconUrl} alt={initials} /> : <span className={`${IconsTextSizes[size]} uppercase`}>{initials}</span>}
                </div>
            </div>
        )
    }
    return (
        <div className={`avatar ${initials && "avatar-placeholder"}`}>
            <div className={`${sizes[size]} ${groups[group]} ${badges[badge]} ${variants[variant]} ${shapes[shape]} ${masks[mask]}`}>
                {iconUrl ? <img src={iconUrl} alt={initials} /> : <span className={`${IconsTextSizes[size]} uppercase`}>{initials}</span>}
            </div>
            {
                logoIndicator &&
                <span className="bg-base-100 absolute bottom-0 end-0 flex translate-x-2 translate-y-2 transform items-center rounded-full p-1">
                    {logoIndicator}
                </span>
            }
        </div >
    )
}