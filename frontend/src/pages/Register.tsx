import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  login: z.string().min(3, "Login deve ter no mínimo 3 caracteres"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmSenha: z.string(),
}).refine((data) => data.senha === data.confirmSenha, {
  message: "As senhas não coincidem",
  path: ["confirmSenha"],
});

type RegisterSchema = z.infer<typeof registerSchema>;

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp({
        email: data.email,
        login: data.login,
        senha: data.senha,
        nivel: "user" // Matching default and DTO
      });
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data) {
          // Backend might return plain string or object
          setError(typeof err.response.data === 'string' ? err.response.data : "Erro ao registrar. Verifique os dados.");
      } else {
        setError("Ocorreu um erro ao registrar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-center p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
             <div className="space-y-2">
              <Label htmlFor="login">Login (Nome de Usuário)</Label>
              <Input
                id="login"
                placeholder="usuario123"
                {...register("login")}
                className={errors.login ? "border-red-500" : ""}
              />
              {errors.login && (
                <p className="text-xs text-red-500">{errors.login.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                {...register("senha")}
                className={errors.senha ? "border-red-500" : ""}
              />
              {errors.senha && (
                <p className="text-xs text-red-500">{errors.senha.message}</p>
              )}
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmSenha">Confirmar Senha</Label>
              <Input
                id="confirmSenha"
                type="password"
                {...register("confirmSenha")}
                className={errors.confirmSenha ? "border-red-500" : ""}
              />
              {errors.confirmSenha && (
                <p className="text-xs text-red-500">{errors.confirmSenha.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
              ) : (
                "Registrar"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Entre aqui
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
