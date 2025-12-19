import {useAuth} from "@/context/auth-context";
import {useEffect, useState} from "react";

export function useLogin() {

  const {login, loading} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (text: string) => {
    setEmail(text);
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  }

  const handleLogin = () => {

    try {
      login(email, password);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3_000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    email,
    password,
    loading,
    error,
    handleEmailChange,
    handlePasswordChange,
    handleLogin
  };
}