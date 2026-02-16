import Button from "@/shared/components/button/button"
import Input from "@/shared/components/input/input"
import { PropsWithChildren, ReactElement, useState, useEffect } from "react"
interface SignupProps {
    setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Signup({ setIsAuthorized }: PropsWithChildren<SignupProps>): ReactElement {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
    const checkValidPhone = (phone: string): boolean => {
        const phoneRegex = /^\+7\d{10}$/;
        return phoneRegex.test(phone);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value.length === 1) {
            if (value === '8' || value === '7') {
                value = '+7';
            } else if (value !== '+') {
                value = '+7' + value.replace(/\D/g, '');
            }
        }
        if (value.length < 2 && value === '+') {
            value = ''; // Если стерли всё, даем полю стать пустым
        }
        const formatted = value.startsWith('+')
            ? '+' + value.replace(/\D/g, '').slice(0, 11)
            : value.replace(/\D/g, '').slice(0, 11);

        setPhone(formatted);
    };
    useEffect(() => {
        handleInputChange({ target: { value: phone } } as React.ChangeEvent<HTMLInputElement>);
        setIsValidPhone(checkValidPhone(phone));
    }, [phone])
    return (
        <>
            <div className="mb-3"><Input value={name} setValue={setName} label="Имя" component="floating" modifier="unfocus" shape="circled" placeholder="Ivan" /></div>
            <div className="mb-3"><Input value={surname} setValue={setSurname} label="Фамилия | Отчество" component="floating" modifier="unfocus" shape="circled" placeholder="Ivanov" /></div>
            <div className="mb-3"><Input value={username} setValue={setUsername} label="Имя пользователя" component="floating" modifier="unfocus" shape="circled" placeholder="@username" /></div>
            <div className="mb-3"><Input state={phone.length == 0 ? "def" : isValidPhone ? "valid" : "invalid"} value={phone} setValue={setPhone} label="Номер телефона" component="floating" modifier="unfocus" shape="circled" placeholder="+79134567890" /></div>
            <div className="mb-3"><Button modifier="rounded_block" label="Создать аккаунт" onClick={() => { setIsAuthorized(true) }} /></div>
        </>
    )
}