using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("usuario")]
public class Usuario
{
    [Key]
    [Column("id_usuario")]
    public long Id { get; set; }

    [Required]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("login")]
    public string Login { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("senha")]
    public string Senha { get; set; } = string.Empty;

    [Required]
    [Column("nivel")]
    public string Nivel { get; set; } = "admin";

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    [Column("refresh_token")]
    public string? RefreshToken { get; set; }

    [Column("refresh_token_expiration")]
    public DateTime? RefreshTokenExpiration { get; set; }

}
