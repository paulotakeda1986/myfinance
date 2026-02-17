using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("carteira")]
public class Carteira
{
    [Key]
    [Column("id_carteira")]
    public long Id { get; set; }

    [Column("id_banco")]
    public long? BancoId { get; set; }
    public Banco? Banco { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("id_tipo_carteira")]
    public long TipoCarteiraId { get; set; }
    public TipoCarteira? TipoCarteira { get; set; }

    [Column("saldo_inicial")]
    public decimal SaldoInicial { get; set; }

    [Column("saldo_atual")]
    public decimal SaldoAtual { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
