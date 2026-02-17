export interface User {
  id: number;
  email: string;
  login: string;
  nivel: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  login: string;
  id: number;
  nivel: string;
}

export interface LoginRequest {
  login?: string; // Optional, as we use email for login
  email: string; 
  senha: string;
}

export interface RegisterRequest {
  // Controller: 
  /*
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        // ...
        var user = new Usuario { Email = request.Email, Login = request.Login, ... }
        // No Nome used.
  */
  email: string;
  login: string;
  senha: string;
  nivel: string;
}
