using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("tipo_carteira")]
public class TipoCarteira
{
    [Key]
    [Column("id_tipo_carteira")]
    public long Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
