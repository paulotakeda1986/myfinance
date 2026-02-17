import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
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

const loginSchema = z.object({
  email: z.string().email("Email inválido"), // Backend expects LoginRequest(Email, Senha) ? 
  // Wait, AuthController Login takes LoginRequest(Email, Senha). 
  // But my AuthContext Login function takes { email, senha }.
  // So field name is 'email'.
  senha: z.string().min(1, "Senha é obrigatória"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(data);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
          setError("Credenciais inválidas. Verifique seu email e senha.");
      } else {
        setError("Ocorreu um erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
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
              <Link
                to="/forgot-password" // Not implemented yet, but good for UI
                className="text-xs text-blue-600 hover:underline float-right tabindex-[-1]"
              >
                Esqueceu a senha?
              </Link>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
