using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("cartao_credito")]
public class CartaoCredito
{
    [Key]
    [Column("id_cartao_credito")]
    public long Id { get; set; }

    [Column("id_banco")]
    public long? BancoId { get; set; }
    public Banco? Banco { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("limite_total")]
    public decimal LimiteTotal { get; set; }

    [Column("limite_atual")]
    public decimal LimiteAtual { get; set; }

    [Column("fl_cartao_credito_ativo")]
    public bool Ativo { get; set; } = true;

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("id_carteira")]
    public long? CarteiraId { get; set; }
    public Carteira? Carteira { get; set; }

    [Column("dia_fechamento_fatura")]
    public int DiaFechamentoFatura { get; set; } = 1;

    [Column("dia_vencimento_fatura")]
    public int DiaVencimentoFatura { get; set; } = 1;

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
