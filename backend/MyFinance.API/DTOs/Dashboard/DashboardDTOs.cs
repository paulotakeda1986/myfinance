namespace MyFinance.API.DTOs.Dashboard
{
    public record DashboardSummaryResponse(
        decimal TotalReceitas,
        decimal TotalDespesas,
        decimal Saldo,
        decimal SaldoAccumulated,
        decimal TotalLimiteCartoes,
        decimal TotalFaturaAtual
    );

    public record CreditCardSummaryResponse(
        string Cartao,
        string Banco,
        decimal LimiteTotal,
        decimal FaturaAtual,
        bool Fechada
    );

    public record WalletBalanceResponse(
        string Carteira,
        string Banco,
        decimal Saldo
    );
}
