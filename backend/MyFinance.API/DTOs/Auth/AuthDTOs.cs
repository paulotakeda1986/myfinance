using System.ComponentModel.DataAnnotations;

namespace MyFinance.API.DTOs.Auth;

public record LoginRequest(
    [Required] string Email,
    [Required] string Senha
);

public record RegisterRequest(
    [Required] string Email,
    [Required] string Login,
    [Required] string Senha,
    string Nivel = "user"
);

public record RefreshTokenRequest(
    [Required] string Token,
    [Required] string RefreshToken
);

public record AuthResponse(
    string Token,
    string RefreshToken,
    string Email,
    string Login,
    long Id,
    string Nivel
);
