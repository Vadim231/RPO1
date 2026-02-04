import { ReactElement, type PropsWithChildren } from "react"
type modifier = "" | "unfocus" | "pilled"
type state = "" | "valid" | "invalid"
type size = "xs" | "sm" | "md" | "lg" | "xl";
type label = string;
type helper = string;
type placeholder = string;
interface InputProps {
    modifier: modifier;
    state: state;
    size: size;
    label: label;
    helper: helper;
    placeholder: placeholder;
    disabled: boolean;
    readonly: boolean;
}
export default function Input({
    modifier = "",
    state = "",
    size = "md",
    label = "",
    helper = "",
    placeholder = "",
    disabled = false,
    readonly = false,
    ...props
}: PropsWithChildren<InputProps>): ReactElement {
    const modifiers: Record<modifier, string> = {
        "": "",
        unfocus: "no-focus",
        pilled: "rounded-xl"
    }
    const states: Record<state, string> = {
        "": "",
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
    const InputClass = `input ${modifiers[modifier]} ${states[state]} ${sizes[size]}`
    return (
        <div className="w-max">
            <label className="label-text" htmlFor="input_id">{label}</label>
            <input type="text" {...props} placeholder={placeholder} className={InputClass} id="input_id" disabled={disabled} readOnly={readonly} />
            <span className="helper-text">{helper}</span>
        </div>
    )
}