using System.ComponentModel.DataAnnotations;

namespace MyFinance.API.DTOs.Lancamento
{
    public record CreateLancamentoRequest(
        [Required] string Descricao,
        [Required] decimal Valor,
        [Required] DateOnly DataLancamento,
        [Required] long TipoLancamentoId, // 1 or 2
        long? CategoriaId, // Receita or Despesa ID
        long? CarteiraId,
        long? CartaoCreditoId, // New field
        bool Parcelado = false,
        int? TotalParcelas = null,
        int? ModoParcelamento = 1, // 1: Dividir, 2: Repetir
        bool Fixo = false,
        bool Efetivada = false
    );

    public record UpdateLancamentoRequest(
        string Descricao,
        decimal Valor,
        DateOnly DataLancamento,
        long? CategoriaId,
        long? CarteiraId,
        long? CartaoCreditoId, // New field
        bool Fixo,
        bool Efetivada,
        int Scope = 1 // 1: Somente este, 2: Futuros, 3: Todos
    );

    public record LancamentoResponse(
        long Id,
        string Descricao,
        decimal Valor,
        DateOnly Data,
        long TipoLancamentoId, // 1 or 2
        long? CategoriaId, // New field
        string? CategoriaNome,
        long? CarteiraId, // New field
        string? CarteiraNome,
        long? CartaoCreditoId, // New field
        string? CartaoNome, // New field
        bool Parcelado,
        int? NumeroParcela,
        int? TotalParcelas,
        bool Efetivada,
        string Status, // "Pago", "Pendente"
        bool IsParcela = false, // New field
        long? LancamentoId = null // New field (parent ID if it's a parcela)
    );
}
