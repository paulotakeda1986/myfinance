using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFinance.API.DTOs.Auth;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using MyFinance.API.Services;

namespace MyFinance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly TokenService _tokenService;

    public AuthController(IUnitOfWork uow, TokenService tokenService)
    {
        _uow = uow;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        // Check if user exists (email or login)
        var existingUserEmail = await _uow.Usuarios.GetByEmailAsync(request.Email);
        if (existingUserEmail != null) return BadRequest("Email já cadastrado.");

        var existingUserLogin = await _uow.Usuarios.GetByLoginAsync(request.Login);
        if (existingUserLogin != null) return BadRequest("Login já cadastrado.");

        var user = new Usuario
        {
            Email = request.Email,
            Login = request.Login,
            Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha),
            Nivel = request.Nivel
        };

        try 
        {
            await _uow.Usuarios.AddAsync(user);
            await _uow.CommitAsync();

            var token = _tokenService.GenerateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiration = DateTime.UtcNow.AddDays(7);
            _uow.Usuarios.Update(user); // Ensure update is tracked
            await _uow.CommitAsync();

            return Ok(new AuthResponse(token, refreshToken, user.Email, user.Login, user.Id, user.Nivel));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error registering user: {ex.Message} {ex.InnerException?.Message}");
            return StatusCode(500, $"Erro interno ao registrar usuário: {ex.Message} {ex.InnerException?.Message}");
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _uow.Usuarios.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Senha, user.Senha))
        {
            return Unauthorized("Email ou senha inválidos.");
        }

        var token = _tokenService.GenerateToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiration = DateTime.UtcNow.AddDays(7);
        _uow.Usuarios.Update(user);
        await _uow.CommitAsync();

        return Ok(new AuthResponse(token, refreshToken, user.Email, user.Login, user.Id, user.Nivel));
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponse>> RefreshToken(RefreshTokenRequest request)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(request.Token);
        var email = principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

        if (email == null) return BadRequest("Invalid token");

        var user = await _uow.Usuarios.GetByEmailAsync(email);

        if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiration <= DateTime.UtcNow)
        {
            return BadRequest("Invalid refresh token");
        }

        var newToken = _tokenService.GenerateToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiration = DateTime.UtcNow.AddDays(7);
        _uow.Usuarios.Update(user);
        await _uow.CommitAsync();

        return Ok(new AuthResponse(newToken, newRefreshToken, user.Email, user.Login, user.Id, user.Nivel));
    }
}
