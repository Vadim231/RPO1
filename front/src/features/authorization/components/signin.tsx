import Button from '@/shared/components/button/button';
import Input from '@/shared/components/input/input';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { useSignIn } from '../hooks/auth';

interface SigninProps {
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Signin({
  setIsAuthorized,
}: PropsWithChildren<SigninProps>): ReactElement {
  const { execute, loading, error } = useSignIn();

  const [isValidPhone, setIsValidPhone] = useState<boolean>(false);
  const [isPhoneSent, setIsPhoneSent] = useState<boolean>(false);
  const [SmsCode, setSmsCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [createdSMScode, setCreatedSMSCode] = useState<string>('');
  const [helper1text, setHelper1Text] = useState<string>('');
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
  const checkValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
  };
  const handleSMSchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Только буквы и цифры

    if (val.length > 3) {
      val = val.slice(0, 3) + '-' + val.slice(3, 6);
    }
    setSmsCode(val.slice(0, 7));
  };
  const login = async () => {
    if (loading) return;
    if (isValidPhone) {
      await execute({
        phone_number: phone,
      })
        .then(() => {
          setCreatedSMSCode('123-XYZ');
          setIsPhoneSent(true);
        })
        .catch((err) => {
          console.log(err);
          setIsPhoneSent(false);
          setHelper1Text('Ошибка при входе. Попробуйте снова.');
          setTimeout(() => setHelper1Text(''), 1500);
        });
    }
    if (!isValidPhone) {
      setHelper1Text('Введите корректный номер телефона!');
      setTimeout(() => setHelper1Text(''), 1500);
    }
    if (phone.length == 0) {
      setHelper1Text('Введите номер телефона!');
      setTimeout(() => setHelper1Text(''), 1500);
    }
  };
  useEffect(() => {
    handleInputChange({
      target: { value: phone },
    } as React.ChangeEvent<HTMLInputElement>);
    setIsValidPhone(checkValidPhone(phone));
  }, [phone]);
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
      {!isPhoneSent ? (
        <div className="mb-3">
          <Input
            helper={helper1text}
            value={phone}
            state={
              error != null
                ? 'invalid'
                : phone.length == 0
                  ? 'def'
                  : isValidPhone
                    ? 'valid'
                    : 'invalid'
            }
            setValue={setPhone}
            label="Номер телефона"
            component="floating"
            modifier="unfocus"
            shape="circled"
            placeholder="+79134567890"
          />
          {/* <span className="mb-3 text-sm text-center text-red-600">{helper1text}</span> */}
        </div>
      ) : (
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
      )}
      <div className="mb-3">
        <Button
          modifier="rounded_block"
          label="Войти"
          onClick={() => {
            login();
          }}
        />
      </div>
    </>
  );
}
