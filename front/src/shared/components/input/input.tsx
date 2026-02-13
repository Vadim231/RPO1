import { BeakerIcon } from "@heroicons/react/24/outline";
import { ReactElement, ReactNode, type PropsWithChildren } from "react"
type modifier = "def" | "unfocus" | "pilled"
type shape = "rounded" | "circled" | "def"
type state = "def" | "valid" | "invalid"
type size = "xs" | "sm" | "md" | "lg" | "xl";
type label = string;
type helper = string;
type placeholder = string;
type type = "default" | "inline" | "L-Icon" | "T-Icon" | "TL-Icon"
type component = "input" | "floating"
interface InputProps {
    modifier?: modifier;
    state?: state;
    size?: size;
    label?: label;
    helper?: helper;
    placeholder?: placeholder;
    disabled?: boolean;
    readonly?: boolean;
    type?: type;
    id?: string;
    component?: component;
    icon?: ReactNode;
    shape?: shape;
}
export default function Input({
    modifier = "def",
    state = "def",
    size = "md",
    label = "",
    helper = "",
    placeholder = "",
    disabled = false,
    readonly = false,
    type = "default",
    component = "input",
    icon = "",
    shape = "def",
    id,
    ...props
}: PropsWithChildren<InputProps>): ReactElement {
    const modifiers: Record<modifier, string> = {
        def: "",
        unfocus: "input no-focus border-0",
        pilled: "rounded-xl"
    }
    const states: Record<state, string> = {
        def: "",
        valid: "is-valid",
        invalid: "is-invalid"
    }
    const sizes: Record<size, string> = {
        xs: "input-xs",
        sm: "input-sm",
        md: "input-md",
        lg: "input-lg",
        xl: "input-xl"
    }
    const shapes: Record<shape, string> = {
        rounded: "rounded-md",
        circled: "rounded-full",
        def: ""
    }
    const InputClass = `${modifiers[modifier]} ${states[state]} ${sizes[size]} ${shapes[shape]}`

    if (component == "input") {
        if (type == "default") {
            return (
                <div className="w-full">
                    <label className={`label-text`} htmlFor={id}>{label}</label>
                    <input type="text" {...props} placeholder={placeholder} className={`input ${InputClass}`} id={id} disabled={disabled} readOnly={readonly} />
                    <span className={`helper-text`}>{helper}</span>
                </div>
            )
        } else if (type == "inline") {
            return (
                <div className="input w-full">
                    <label className="label-text my-auto me-3 p-0" htmlFor={id}>Name</label>
                    <input type="text" {...props} placeholder={placeholder} className={`grow ${InputClass}`} id={id} disabled={disabled} readOnly={readonly} />
                </div>
            )
        } else if (type == "L-Icon") {
            return (
                <div className="input w-full">
                    <span className={`text-base-content/80 my-auto me-3 size-5 shrink-0`}>
                        {icon ? icon : <BeakerIcon />}
                    </span>
                    <input type="text" {...props} placeholder={placeholder} className={`grow ${InputClass}`} id={id} disabled={disabled} readOnly={readonly} />
                </div>
            )
        } else if (type == "T-Icon") {
            return (
                <div className="input w-full">
                    <input type="text" className={`grow ${states[state]}`} placeholder={placeholder} id={id} />
                    <label className="sr-only" htmlFor={id}>{label}</label>
                    <span className="text-base-content/80 my-auto ms-3 size-5 shrink-0">{icon}</span>
                </div>
            )
        } else if (type == "TL-Icon") {
            return (
                <div className="input w-full space-x-3" >
                    <span className="label-text my-auto">{icon}</span>
                    <input type="text" className={`grow ${states[state]}`} placeholder={placeholder} id={id} />
                    <label className="sr-only" htmlFor={id}>Enter amount</label>
                    <span className={`helper-text`}>{helper}</span>
                    <span className="text-base-content/80 my-auto ms-3 size-5 shrink-0">{icon}</span>
                </div >
            )
        } else {
            return (
                <></>
            )
        }
    } else if (component == "floating") {
        if (type == "default") {
            return (
                <div className={`input-floating w-full`}>
                    <input
                        type="text"
                        placeholder={placeholder}
                        id={id}
                        className={`input ${InputClass}`}
                        disabled={disabled}
                        readOnly={readonly}
                        {...props}
                    />
                    <label
                        className={`input-floating-label`}
                        htmlFor={id}
                    >
                        {label}
                    </label>
                    <span
                        className={`helper-text`}
                    >
                        {helper}
                    </span>
                </div>
            )
        } else if (type == "inline") {
            return (
                <div className="input w-full">
                    <label className="label-text my-auto me-3 p-0" htmlFor={id}>Name</label>
                    <input type="text" {...props} placeholder={placeholder} className={`grow ${InputClass}`} id={id} disabled={disabled} readOnly={readonly} />
                    <span className={`helper-text`}>{helper}</span>
                </div>
            )
        } else if (type == "L-Icon") {
            return (
                <div className="input w-full">
                    <span className="text-base-content/80 my-auto size-5 shrink-0">{icon}</span>
                    <div className="input-floating grow">
                        <input type="text" placeholder="John Doe" className="ps-3" id={id} />
                        <label className="input-floating-label" htmlFor={id}>Full name</label>
                        <span className={`helper-text`}>{helper}</span>
                    </div>
                </div>
            )
        } else if (type == "T-Icon") {
            return (
                <div className="input w-full" >
                    <div className="input-floating grow">
                        <input type="text" className={`grow ${states[state]}`} placeholder={placeholder} id={id} />
                        <label className="input-floating-label ms-0" htmlFor={id}>{label}</label>
                        <span className={`helper-text`}>{helper}</span>
                    </div>
                    <span className="text-base-content/80 my-auto ms-3 size-5 shrink-0">{icon}</span>
                </div >
            )
        } else if (type == "TL-Icon") {
            return (
                <div className="input w-full space-x-3" >
                    <span className="label-text my-auto">{icon}</span>
                    <input type="text" className={`grow ${states[state]}`} placeholder={placeholder} id={id} />
                    <label className="sr-only" htmlFor={id}>Enter amount</label>
                    <span className={`helper-text`}>{helper}</span>
                    <span className="text-base-content/80 my-auto ms-3 size-5 shrink-0">{icon}</span>
                </div >
            )
        } else {
            return (
                <></>
            )
        }
    } else {
        return (<></>)
    }
}
