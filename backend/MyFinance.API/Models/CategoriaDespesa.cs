using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("categoria_despesa")]
public class CategoriaDespesa
{
    [Key]
    [Column("id_categoria_despesa")]
    public long Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("fl_fixo")]
    public bool Fixo { get; set; }

    [Column("valor_fixo_categoria_despesa")]
    public decimal ValorFixo { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
