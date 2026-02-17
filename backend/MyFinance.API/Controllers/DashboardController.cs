using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.DTOs.Dashboard;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public DashboardController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token.");
            }
            return userId;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryResponse>> GetSummary([FromQuery] int mes, [FromQuery] int ano)
        {
            try
            {
                var userId = GetUserId();

                // 1. Get Single Lancamentos (Not Parcelado)
                var lancamentos = await _uow.Lancamentos.FindAsync(l => 
                    l.UsuarioId == userId && 
                    !l.Parcelado && 
                    l.DataLancamento.Month == mes && 
                    l.DataLancamento.Year == ano);

                // 2. Get Parcelas
                // Optimized approach: Get all parcelado lancamentos for user, then filter parcelas.
                // In a real scenario with many years of data, this needs a better query (e.g. JOIN).
                var parceladoLancamentos = await _uow.Lancamentos.FindAsync(l => l.UsuarioId == userId && l.Parcelado);
                var parceladoIds = parceladoLancamentos.Select(l => l.Id).ToHashSet();
                
                var parcelas = await _uow.Parcelas.FindAsync(p => 
                    parceladoIds.Contains(p.LancamentoFinanceiroId) && 
                    p.DataVencimento.Month == mes &&
                    p.DataVencimento.Year == ano);

                decimal totalReceitas = 0;
                decimal totalDespesas = 0;

                // Sum Singles
                foreach (var l in lancamentos)
                {
                    if (l.TipoLancamentoId == 1) // Receita
                        totalReceitas += l.Valor;
                    else if (l.TipoLancamentoId == 2) // Despesa
                        totalDespesas += l.Valor;
                }

                // Sum Parcelas
                foreach (var p in parcelas)
                {
                    var parent = parceladoLancamentos.FirstOrDefault(l => l.Id == p.LancamentoFinanceiroId);
                    if (parent != null)
                    {
                        if (parent.TipoLancamentoId == 1) // Receita
                            totalReceitas += p.Valor;
                        else if (parent.TipoLancamentoId == 2) // Despesa
                            totalDespesas += p.Valor;
                    }
                }

                // Calculate Wallets Total (SaldoAtual)
                var carteiras = await _uow.Carteiras.FindAsync(c => c.UsuarioId == userId);
                decimal saldoAccumulated = carteiras.Sum(c => c.SaldoAtual);

                // Calculate Credit Card Stats
                var cartoes = await _uow.CartoesCredito.FindAsync(c => c.UsuarioId == userId);
                decimal totalLimite = cartoes.Sum(c => c.LimiteTotal);
                
                var faturas = await _uow.FaturasCartaoCredito.FindAsync(f => 
                    f.UsuarioId == userId && 
                    f.Competencia != null &&
                    f.Competencia.Mes == mes && 
                    f.Competencia.Exercicio == ano);
                
                decimal totalFatura = 0;
                foreach (var f in faturas)
                {
                   var lSum = (await _uow.Lancamentos.FindAsync(l => l.FaturaCartaoId == f.Id)).Sum(l => l.Valor);
                   var pSum = (await _uow.Parcelas.FindAsync(p => p.FaturaCartaoId == f.Id)).Sum(p => p.Valor);
                   totalFatura += (lSum + pSum);
                }

                return Ok(new DashboardSummaryResponse(
                    totalReceitas,
                    totalDespesas,
                    totalReceitas - totalDespesas,
                    saldoAccumulated,
                    totalLimite,
                    totalFatura
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("wallets")]
        public async Task<ActionResult<IEnumerable<WalletBalanceResponse>>> GetWalletBalances()
        {
             try
            {
                var userId = GetUserId();
                 var carteiras = await _uow.Carteiras.FindAsync(c => c.UsuarioId == userId);
                 var response = carteiras.Select(c => new WalletBalanceResponse(
                     c.Nome,
                     c.Banco?.Nome ?? "N/A", // Need to ensure Banco is loaded? Repository FindAsync might not include navigation properties.
                     // The generic repository FindAsync usually just uses DbSet.Where().ToList(). 
                     // It does NOT Include() by default unless overridden.
                     // So Banco might be null.
                     // We should fetch banks to map names or accept null.
                     c.SaldoAtual
                 ));
                 
                 // If Banco is null, we might want to fetch it.
                 // Optimized: Fetch all banks and map in memory or use proper query.
                 // For now, let's just return what we have (might be null).
                 // Actually, "Banco" property on response is string.
                 
                 // Let's reload to be sure or use GetUserId logic safely.
                 // A better way: Fetch all banks (cached/reference) since there are few.
                 
                 // Re-fetching with Include would be best. 
                 // Assuming standard repository doesn't include.
                 
                 // Let's fetch banks.
                 var bancos = await _uow.Bancos.GetAllAsync();
                 var bancosMap = bancos.ToDictionary(b => b.Id, b => b.Nome);

                 var detailedResponse = carteiras.Select(c => new WalletBalanceResponse(
                     c.Nome,
                     (c.BancoId.HasValue && bancosMap.ContainsKey(c.BancoId.Value)) ? bancosMap[c.BancoId.Value] : "N/A",
                     c.SaldoAtual
                 ));

                 return Ok(detailedResponse);
            }
             catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("credit-cards")]
        public async Task<ActionResult<IEnumerable<CreditCardSummaryResponse>>> GetCreditCards([FromQuery] int mes, [FromQuery] int ano)
        {
            try
            {
                var userId = GetUserId();
                var cartoes = await _uow.CartoesCredito.FindAsync(c => c.UsuarioId == userId);
                var bancos = await _uow.Bancos.GetAllAsync();
                var bancosMap = bancos.ToDictionary(b => b.Id, b => b.Nome);

                var response = new List<CreditCardSummaryResponse>();

                foreach (var c in cartoes)
                {
                    var faturas = await _uow.FaturasCartaoCredito.FindAsync(f => 
                        f.UsuarioId == userId && 
                        f.CartaoCreditoId == c.Id && 
                        f.Competencia != null &&
                        f.Competencia.Mes == mes && 
                        f.Competencia.Exercicio == ano);
                    
                    var fatura = faturas.FirstOrDefault();
                    decimal faturaValue = 0;
                    bool fechada = false;

                    if (fatura != null)
                    {
                        var lSum = (await _uow.Lancamentos.FindAsync(l => l.FaturaCartaoId == fatura.Id)).Sum(l => l.Valor);
                        var pSum = (await _uow.Parcelas.FindAsync(p => p.FaturaCartaoId == fatura.Id)).Sum(p => p.Valor);
                        faturaValue = lSum + pSum;
                        fechada = fatura.Fechada;
                    }

                    response.Add(new CreditCardSummaryResponse(
                        c.Nome,
                        (c.BancoId.HasValue && bancosMap.ContainsKey(c.BancoId.Value)) ? bancosMap[c.BancoId.Value] : "N/A",
                        c.LimiteTotal,
                        faturaValue,
                        fechada
                    ));
                }

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
