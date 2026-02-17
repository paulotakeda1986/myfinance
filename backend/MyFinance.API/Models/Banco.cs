using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("banco")]
public class Banco
{
    [Key]
    [Column("id_banco")]
    public long Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("codigo_banco")]
    public string Codigo { get; set; } = string.Empty;

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
