"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Zap, AlertCircle, Eye, EyeOff, Check, X } from "lucide-react";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/auth";

// ── Validaciones de contraseña ──────────────────────
interface PasswordRule {
  label: string;
  test: (pwd: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "Mínimo 8 caracteres",          test: (p) => p.length >= 8 },
  { label: "Al menos una mayúscula",        test: (p) => /[A-Z]/.test(p) },
  { label: "Al menos un número",            test: (p) => /[0-9]/.test(p) },
  { label: "Al menos un carácter especial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (passed === 0) return { score: 0, label: "",          color: "#374151" };
  if (passed === 1) return { score: 25, label: "Débil",    color: "#EF4444" };
  if (passed === 2) return { score: 50, label: "Regular",  color: "#F59E0B" };
  if (passed === 3) return { score: 75, label: "Buena",    color: "#3B82F6" };
  return               { score: 100, label: "Excelente", color: "#22C55E" };
}

function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(password));
}

// ── Componente ───────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const strength = getPasswordStrength(password);

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al conectar con Google.");
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    setError("");
    setSuccess("");

    // Validaciones comunes
    if (!email.trim()) { setError("Ingresa tu email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("El email no tiene un formato válido."); return; }
    if (!password) { setError("Ingresa tu contraseña."); return; }

    // Validaciones solo en registro
    if (mode === "signup") {
      if (!isPasswordValid(password)) {
        setError("La contraseña no cumple los requisitos de seguridad.");
        setPasswordTouched(true);
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        router.push("/profile");
        router.refresh();
      } else {
        await signUpWithEmail(email, password);
        setSuccess("Cuenta creada. Revisa tu correo para confirmar.");
        setMode("login");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPasswordTouched(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Algo salió mal.";
      if (msg.includes("Invalid login credentials")) {
        setError("Email o contraseña incorrectos.");
      } else if (msg.includes("User already registered")) {
        setError("Ya existe una cuenta con este email. Inicia sesión.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
    setPasswordTouched(false);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, #7C3AED18, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}
          >
            <Zap size={20} style={{ color: "#A78BFA" }} />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold" style={{ color: "#F0F0FF" }}>
              {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              {mode === "login"
                ? "Inicia sesión para continuar"
                : "Empieza a generar contenido en segundos"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "#13131A", border: "1px solid #2A2A35" }}
        >
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all disabled:opacity-50"
            style={{ background: "#1E1E2E", border: "1px solid #2A2A35", color: "#F0F0FF" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#252535")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1E1E2E")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "#2A2A35" }} />
            <span className="text-xs" style={{ color: "#4B5563" }}>o</span>
            <div className="flex-1 h-px" style={{ background: "#2A2A35" }} />
          </div>

          {/* Formulario */}
          <div className="space-y-3">
            {/* Email */}
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="tu@email.com"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: "#1A1A24", border: "1px solid #2A2A35", color: "#F0F0FF" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2A35")}
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubmit(); }}
                placeholder="Contraseña"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: "#1A1A24", border: "1px solid #2A2A35", color: "#F0F0FF" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2A35")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: "#4B5563" }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Indicador de fortaleza — solo en registro */}
            {mode === "signup" && password.length > 0 && (
              <div className="space-y-2">
                {/* Barra de fortaleza */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1A1A24" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${strength.score}%`, background: strength.color }}
                    />
                  </div>
                  {strength.label && (
                    <span className="text-xs font-medium shrink-0" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>

                {/* Checklist de requisitos */}
                {passwordTouched && (
                  <div className="space-y-1">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <div key={rule.label} className="flex items-center gap-1.5">
                          {passed
                            ? <Check size={11} style={{ color: "#22C55E" }} />
                            : <X size={11} style={{ color: "#EF4444" }} />
                          }
                          <span className="text-xs" style={{ color: passed ? "#22C55E" : "#6B7280" }}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Confirmar contraseña — solo en registro */}
            {mode === "signup" && (
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleEmailSubmit(); }}
                  placeholder="Confirmar contraseña"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#1A1A24",
                    border: `1px solid ${
                      confirmPassword.length > 0
                        ? password === confirmPassword ? "#22C55E" : "#EF4444"
                        : "#2A2A35"
                    }`,
                    color: "#F0F0FF",
                  }}
                  onFocus={(e) => {
                    if (confirmPassword.length === 0) e.currentTarget.style.borderColor = "#7C3AED";
                  }}
                  onBlur={(e) => {
                    if (confirmPassword.length === 0) e.currentTarget.style.borderColor = "#2A2A35";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: "#4B5563" }}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {/* Indicador de coincidencia */}
                {confirmPassword.length > 0 && (
                  <div className="absolute right-9 top-1/2 -translate-y-1/2">
                    {password === confirmPassword
                      ? <Check size={13} style={{ color: "#22C55E" }} />
                      : <X size={13} style={{ color: "#EF4444" }} />
                    }
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mensajes */}
          {error && (
            <div className="flex items-start gap-2 text-sm" style={{ color: "#F87171" }}>
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 text-sm" style={{ color: "#22C55E" }}>
              <Check size={14} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Botón principal */}
          <button
            onClick={handleEmailSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-medium text-sm cursor-pointer transition-all disabled:opacity-50"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.5)", color: "#C4B5FD" }}
          >
            {isLoading
              ? "Cargando..."
              : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>

          {/* Términos — solo en registro */}
          {mode === "signup" && (
            <p className="text-xs text-center" style={{ color: "#4B5563" }}>
              Al crear una cuenta aceptas nuestros{" "}
              <span style={{ color: "#A78BFA" }}>Términos de uso</span> y{" "}
              <span style={{ color: "#A78BFA" }}>Política de privacidad</span>
            </p>
          )}
        </div>

        {/* Toggle */}
        <p className="text-center text-sm" style={{ color: "#6B7280" }}>
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            className="font-medium cursor-pointer"
            style={{ color: "#A78BFA" }}
          >
            {mode === "login" ? "Regístrate gratis" : "Inicia sesión"}
          </button>
        </p>

        <p className="text-center">
          <Link href="/" className="text-xs" style={{ color: "#4B5563" }}>
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}