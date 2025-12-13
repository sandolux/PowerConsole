"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, isLoading, registerInitialUser, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) {
      router.push("/");
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegError(null);
    const result = await registerInitialUser({
      username: regUsername,
      password: regPassword,
      email: regEmail,
    });
    if (!result) {
      setRegError("No se pudo crear el usuario. Revisa los datos.");
      return;
    }
    setShowRegister(false);
    setUsername(result.username);
    setPassword("");
  };

  const inputClass =
    "w-full border border-gray-700 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">PowerConsole</h1>
          <p className="text-sm text-gray-400 mt-1">Inicia sesión para continuar.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              placeholder="nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="border-t border-gray-800 pt-4">
          <p className="text-sm text-gray-400 mb-3">¿No tienes usuario?</p>
          <button
            onClick={() => setShowRegister(true)}
            className="w-full text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            Registrar Usuario Inicial
          </button>
        </div>
      </div>

      {showRegister && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-100">Registrar Usuario Inicial</h2>
              <button
                onClick={() => setShowRegister(false)}
                className="text-gray-400 hover:text-gray-200"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <form className="space-y-3" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Usuario</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              {regError && <p className="text-sm text-red-500">{regError}</p>}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="text-sm text-gray-400 hover:text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Crear usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
