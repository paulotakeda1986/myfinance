using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("competencia")]
public class Competencia
{
    [Key]
    [Column("id_competencia")]
    public long Id { get; set; }

    [Required]
    [Column("mes")]
    public int Mes { get; set; }

    [Required]
    [Column("exercicio")]
    public int Exercicio { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
