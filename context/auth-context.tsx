import getAuthService from "@/services/auth-service";
import {clearSessionFromStorage, loadSessionFromStorage, saveSessionToStorage} from "@/utils/storage";
import {useRouter} from "expo-router";
import {decodeJwt} from 'jose';
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Alert} from "react-native";

interface AuthContextProps {
	user: User | null;
	login: (email: string, password: string) => void;
	logout: () => void;
	loading: boolean;
}

export interface User {
	id: string
	email: string;
	token: string;
}

export interface JwtPayload {
	sub: string;
	email: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {

	const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();


	useEffect(() => {
		loadSessionFromStorage().then((loadedUser) => {
			if (loadedUser) {
				setUser(loadedUser);
			}
		});
	}, []);

	useEffect(() => {
		if (user) {
			router.replace('/(tabs)');
		}
	}, [user, router]);

	const login = async (email: string, password: string) => {
		const authClient = getAuthService();
		setLoading(true);

		try {
			const loginResponse = await authClient.login({email, password});
			const token = loginResponse.data.token;
			const decodedToken = decodeJwt<JwtPayload>(token);

			const loggedInUser: User = {
				id: decodedToken.sub,
				email: decodedToken.email,
				token
			};
			setUser(loggedInUser);
			await saveSessionToStorage(loggedInUser);

		} catch (error) {
			Alert.alert('Error de Login', (error as Error).message);
		} finally {
			setLoading(false);
		}

		if (!email || !password) {
			throw new Error('Email y contraseña son obligatorios');
		}

		if (!emailRegex.test(email)) {
			throw new Error('El formato del email no es válido');
		}

	};

	const logout = () => {
		setUser(null);
		clearSessionFromStorage();
	};

	return (
		<AuthContext.Provider value={{user, login, logout, loading}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe usarse dentro de un AuthProvider');
	}
	return context;
}

