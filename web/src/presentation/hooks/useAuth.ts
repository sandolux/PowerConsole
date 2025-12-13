"use client";

import { useCallback, useEffect, useState } from "react";
import { useDi } from "@/presentation/context/DiContext";
import { User } from "@/core/domain/entities/User";

const STORAGE_KEY = "pc_current_user";

export const useAuth = () => {
  const { loginUserUseCase, userRepo, createUserUseCase } = useDi();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!storedUsername) {
      setIsLoading(false);
      return;
    }
    (async () => {
      const found = await userRepo.findByUsername(storedUsername);
      setUser(found ?? null);
      setIsLoading(false);
    })();
  }, [userRepo]);

  const login = useCallback(
    async (username: string, password: string) => {
      setError(null);
      const result = await loginUserUseCase.execute({ username, password });
      if (result) {
        setUser(result);
        localStorage.setItem(STORAGE_KEY, result.username);
        return true;
      }
      setError("Credenciales incorrectas");
      return false;
    },
    [loginUserUseCase]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const registerInitialUser = useCallback(
    async (data: { username: string; password: string; email: string }) => {
      setError(null);
      const existing = await userRepo.findByUsername(data.username);
      if (existing) {
        setError("El usuario ya existe");
        return null;
      }
      const newUser = await createUserUseCase.execute({
        id: crypto.randomUUID(),
        username: data.username,
        email: data.email,
        password: data.password,
      });
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, newUser.username);
      return newUser;
    },
    [createUserUseCase, userRepo]
  );

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    logout,
    registerInitialUser,
  };
};
