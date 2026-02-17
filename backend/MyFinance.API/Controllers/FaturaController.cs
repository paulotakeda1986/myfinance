using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.DTOs.Fatura;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FaturaController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public FaturaController(IUnitOfWork uow)
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FaturaResponse>>> Get()
        {
            try
            {
                var userId = GetUserId();
                var faturas = await _uow.FaturasCartaoCredito.FindAsync(f => f.UsuarioId == userId);
                var cartoes = await _uow.CartoesCredito.FindAsync(c => c.UsuarioId == userId);
                var competencias = await _uow.Competencias.FindAsync(c => c.UsuarioId == userId);

                var response = new List<FaturaResponse>();

                foreach (var f in faturas)
                {
                    var card = cartoes.FirstOrDefault(c => c.Id == f.CartaoCreditoId);
                    var comp = competencias.FirstOrDefault(c => c.Id == f.CompetenciaId);

                    // Dynamic calculation of value
                    var sumLancamentos = (await _uow.Lancamentos.FindAsync(l => l.FaturaCartaoId == f.Id)).Sum(l => l.Valor);
                    var sumParcelas = (await _uow.Parcelas.FindAsync(p => p.FaturaCartaoId == f.Id)).Sum(p => p.Valor);

                    response.Add(new FaturaResponse(
                        f.Id,
                        f.CartaoCreditoId,
                        card?.Nome ?? "Cartão não encontrado",
                        f.CompetenciaId,
                        comp != null ? $"{comp.Mes:D2}/{comp.Exercicio}" : "??/????",
                        sumLancamentos + sumParcelas,
                        f.Fechada,
                        f.DataFechamento
                    ));
                }

                return Ok(response.OrderByDescending(f => f.CompetenciaId));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost("{id}/pagar")]
        public async Task<IActionResult> Pagar(long id)
        {
            try
            {
                var userId = GetUserId();
                var fatura = await _uow.FaturasCartaoCredito.GetByIdAsync(id);

                if (fatura == null || fatura.UsuarioId != userId) return NotFound();
                if (fatura.Fechada) return BadRequest("Fatura já está fechada.");

                var cartao = await _uow.CartoesCredito.GetByIdAsync(fatura.CartaoCreditoId);
                if (cartao == null || cartao.CarteiraId == null)
                    return BadRequest("O cartão deve estar vinculado a uma carteira para realizar o pagamento automático.");

                // 1. Calculate Total
                var lancamentos = await _uow.Lancamentos.FindAsync(l => l.FaturaCartaoId == fatura.Id);
                var parcelas = await _uow.Parcelas.FindAsync(p => p.FaturaCartaoId == fatura.Id);
                decimal totalValue = lancamentos.Sum(l => l.Valor) + parcelas.Sum(p => p.Valor);

                if (totalValue <= 0) return BadRequest("O valor da fatura deve ser maior que zero.");

                var competencia = await _uow.Competencias.GetByIdAsync(fatura.CompetenciaId);

                // 2. Create the Wallet Expense (Pago pela carteira)
                var pagamento = new LancamentoFinanceiro
                {
                    UsuarioId = userId,
                    Descricao = $"Pagamento Fatura {cartao.Nome} - {competencia?.Mes:D2}/{competencia?.Exercicio}",
                    Valor = totalValue,
                    DataLancamento = DateOnly.FromDateTime(DateTime.Today),
                    TipoLancamentoId = 2, // Despesa
                    CarteiraId = cartao.CarteiraId,
                    Efetivada = true,
                    CriadoEm = DateTime.UtcNow
                };
                
                // We should find a default category or just use null
                // Maybe the user wants a category? Let's use null for now.

                await _uow.Lancamentos.AddAsync(pagamento);

                // 3. Mark all transactions as Paid
                foreach (var l in lancamentos)
                {
                    l.Efetivada = true;
                    _uow.Lancamentos.Update(l);
                }

                foreach (var p in parcelas)
                {
                    p.Pago = true;
                    _uow.Parcelas.Update(p);
                }

                // 4. Close Fatura
                fatura.Fechada = true;
                fatura.DataFechamento = DateOnly.FromDateTime(DateTime.Today);
                fatura.Valor = totalValue; // Store the final value
                _uow.FaturasCartaoCredito.Update(fatura);

                await _uow.CommitAsync();

                return Ok();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
