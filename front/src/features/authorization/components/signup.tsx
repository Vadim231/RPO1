import Button from '@/shared/components/button/button';
import Input from '@/shared/components/input/input';
import { PropsWithChildren, ReactElement, useState, useEffect } from 'react';
import { useSignUp } from '../hooks/auth';
interface SignupProps {
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Signup({
  setIsAuthorized,
}: PropsWithChildren<SignupProps>): ReactElement {
  const { execute } = useSignUp();

  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [SmsCode, setSmsCode] = useState<string>('');
  const [createdSMScode, setCreatedSMSCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // isValid states
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [isValidSurname, setIsValidSurname] = useState<boolean>(false);
  const [isValidUsername, setIsValidUsername] = useState<boolean>(false);
  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [isValidData, setIsValidData] = useState<boolean>(true);
  const [isPhoneSent, setIsPhoneSent] = useState<boolean>(false);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const checkValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
  };
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
      value = '';
    }
    const formatted = value.startsWith('+')
      ? '+' + value.replace(/\D/g, '').slice(0, 11)
      : value.replace(/\D/g, '').slice(0, 11);

    setPhone(formatted);
  };
  useEffect(() => {
    handleInputChange({
      target: { value: phone },
    } as React.ChangeEvent<HTMLInputElement>);
    setIsValidPhone(checkValidPhone(phone));
  }, [phone]);
  useEffect(() => {
    setIsValidName(name.length >= 2);
    setIsValidSurname(surname.length >= 3);
    setIsValidUsername(username.length >= 5);
    setIsValidPhone(checkValidPhone(phone));
    setIsValidPassword(password.length >= 6);
  }, [name, surname, username, phone, password]);
  const handleSMSchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Только буквы и цифры

    if (val.length > 3) {
      val = val.slice(0, 3) + '-' + val.slice(3, 6);
    }
    setSmsCode(val.slice(0, 7));
  };
  const checkValidCode = (code: string): boolean => {
    const codeRegex = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/i;
    return codeRegex.test(code);
  };
  useEffect(() => {
    setCreatedSMSCode('123-XYZ');
    handleSMSchange({
      target: { value: SmsCode },
    } as React.ChangeEvent<HTMLInputElement>);
    if (SmsCode.length === 7) {
      setTimeout(() => {
        if (checkValidCode && SmsCode === createdSMScode)
          setIsAuthorized(checkValidCode(SmsCode));
      }, 250);
    }
  }, [SmsCode]);

  return (
    <>
      {isPhoneSent ? (
        <>
          <div className="mb-3">
            <Input
              value={SmsCode}
              state={
                SmsCode.length == 0
                  ? 'def'
                  : checkValidCode(SmsCode)
                    ? 'valid'
                    : 'invalid'
              }
              setValue={setSmsCode}
              label="Код с почты"
              placeholder="123-XYZ"
              component="floating"
              shape="circled"
            />
          </div>
          {!checkValidCode(SmsCode) && SmsCode.length > 0 ? (
            <span className="mb-3 text-sm text-center text-red-600">
              Неверный код!
            </span>
          ) : (
            ''
          )}
        </>
      ) : (
        <>
          <div className="mb-3">
            <Input
              state={
                name.length == 0 ? 'def' : isValidName ? 'valid' : 'invalid'
              }
              value={name}
              setValue={setName}
              label="Имя"
              component="floating"
              modifier="unfocus"
              shape="circled"
              placeholder="Ivan"
            />
          </div>
          <div className="mb-3">
            <Input
              state={
                surname.length == 0
                  ? 'def'
                  : isValidSurname
                    ? 'valid'
                    : 'invalid'
              }
              value={surname}
              setValue={setSurname}
              label="Фамилия | Отчество"
              component="floating"
              modifier="unfocus"
              shape="circled"
              placeholder="Ivanov"
            />
          </div>
          <div className="mb-3">
            <Input
              state={
                username.length == 0
                  ? 'def'
                  : isValidUsername
                    ? 'valid'
                    : 'invalid'
              }
              value={username}
              setValue={setUsername}
              label="Имя пользователя"
              component="floating"
              modifier="unfocus"
              shape="circled"
              placeholder="@username"
            />
          </div>
          <div className="mb-3">
            <Input
              state={
                phone.length == 0 ? 'def' : isValidPhone ? 'valid' : 'invalid'
              }
              value={phone}
              setValue={setPhone}
              label="Номер телефона"
              component="floating"
              modifier="unfocus"
              shape="circled"
              placeholder="+79134567890"
            />
          </div>
          <div className="mb-3">
            <Input
              state={
                password.length == 0
                  ? 'def'
                  : isValidPassword
                    ? 'valid'
                    : 'invalid'
              }
              InputType="password"
              value={password}
              setValue={setPassword}
              label="Пароль"
              component="floating"
              modifier="unfocus"
              shape="circled"
              placeholder="********"
            />
          </div>
          {isValidData ? (
            ''
          ) : (
            <span className="mb-3 text-sm text-center text-red-600">
              Кажется вы что-то не ввели! <br /> Или ввели не правильно?
            </span>
          )}
          <div className="mb-3">
            <Button
              modifier="rounded_block"
              label="Создать аккаунт"
              onClick={async () => {
                if (
                  isValidName &&
                  isValidSurname &&
                  isValidUsername &&
                  isValidPhone
                ) {
                  console.log(name, surname, username, phone);
                  await execute({
                    first_name: name,
                    last_name: surname,
                    username: username,
                    phone_number: phone,
                    password: password,
                  });
                  setIsPhoneSent(true);
                } else {
                  setIsValidData(false);
                  setTimeout(() => setIsValidData(true), 2000);
                }
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
