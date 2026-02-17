using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.DTOs.Lancamento;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LancamentoController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public LancamentoController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        private async Task<long> GetOrCreateFaturaAsync(long userId, long cartaoId, DateOnly date)
        {
            var mes = date.Month;
            var ano = date.Year;
            
            var competencias = await _uow.Competencias.FindAsync(c => c.UsuarioId == userId && c.Mes == mes && c.Exercicio == ano);
            var competencia = competencias.FirstOrDefault();
            
            if (competencia == null)
            {
                competencia = new Competencia { UsuarioId = userId, Mes = mes, Exercicio = ano, CriadoEm = DateTime.UtcNow };
                await _uow.Competencias.AddAsync(competencia);
                await _uow.CommitAsync();
            }

            var faturas = await _uow.FaturasCartaoCredito.FindAsync(f => f.UsuarioId == userId && f.CartaoCreditoId == cartaoId && f.CompetenciaId == competencia.Id);
            var fatura = faturas.FirstOrDefault();

            if (fatura == null)
            {
                fatura = new FaturaCartaoCredito 
                { 
                    UsuarioId = userId, 
                    CartaoCreditoId = cartaoId, 
                    CompetenciaId = competencia.Id,
                    Valor = 0,
                    Fechada = false,
                    CriadoEm = DateTime.UtcNow 
                };
                await _uow.FaturasCartaoCredito.AddAsync(fatura);
                await _uow.CommitAsync();
            }

            return fatura.Id;
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
        public async Task<ActionResult<IEnumerable<LancamentoResponse>>> Get([FromQuery] int mes, [FromQuery] int ano)
        {
            try
            {
                var userId = GetUserId();

                // 1. Get Non-Parcelado Lancamentos for the period
                var lancamentos = await _uow.Lancamentos.FindAsync(l => 
                    l.UsuarioId == userId && 
                    !l.Parcelado && 
                    ((l.DataLancamento.Month == mes && l.DataLancamento.Year == ano) || (mes == 0 || ano == 0)));

                var parceladoLancamentos = await _uow.Lancamentos.FindAsync(l => l.UsuarioId == userId && l.Parcelado);
                var parceladoIds = parceladoLancamentos.Select(l => l.Id).ToHashSet();

                var parcelas = await _uow.Parcelas.FindAsync(p => 
                    parceladoIds.Contains(p.LancamentoFinanceiroId) && 
                    ((p.DataVencimento.Month == mes && p.DataVencimento.Year == ano) || (mes == 0 || ano == 0)));

                // Prepare Reference Data
                var categoriasReceita = await _uow.CategoriasReceita.GetAllAsync();
                var categoriasDespesa = await _uow.CategoriasDespesa.GetAllAsync();
                var carteiras = await _uow.Carteiras.GetAllAsync();
                var cartoes = await _uow.CartoesCredito.FindAsync(c => c.UsuarioId == userId);
                var faturas = await _uow.FaturasCartaoCredito.FindAsync(f => f.UsuarioId == userId);

                var response = new List<LancamentoResponse>();

                // Add Single Lancamentos
                foreach (var l in lancamentos)
                {
                    string? catNome = null;
                    if (l.CategoriaReceitaId.HasValue) catNome = categoriasReceita.FirstOrDefault(c => c.Id == l.CategoriaReceitaId)?.Nome;
                    else if (l.CategoriaDespesaId.HasValue) catNome = categoriasDespesa.FirstOrDefault(c => c.Id == l.CategoriaDespesaId)?.Nome;

                    string? cartaoNome = null;
                    long? cartaoId = null;
                    if (l.FaturaCartaoId.HasValue)
                    {
                        var fatura = faturas.FirstOrDefault(f => f.Id == l.FaturaCartaoId);
                        if (fatura != null)
                        {
                            var cartao = cartoes.FirstOrDefault(c => c.Id == fatura.CartaoCreditoId);
                            cartaoNome = cartao?.Nome;
                            cartaoId = cartao?.Id;
                        }
                    }

                    response.Add(new LancamentoResponse(
                        l.Id,
                        l.Descricao,
                        l.Valor,
                        l.DataLancamento,
                        l.TipoLancamentoId,
                        l.CategoriaReceitaId ?? l.CategoriaDespesaId,
                        catNome,
                        l.CarteiraId,
                        carteiras.FirstOrDefault(c => c.Id == l.CarteiraId)?.Nome,
                        cartaoId,
                        cartaoNome,
                        false,
                        null,
                        null,
                        l.Efetivada,
                        l.Efetivada ? "Pago" : "Pendente",
                        false,
                        null
                    ));
                }

                // Add Parcelas
                foreach (var p in parcelas)
                {
                    var parent = parceladoLancamentos.FirstOrDefault(l => l.Id == p.LancamentoFinanceiroId);
                    if (parent == null) continue;

                    string? catNome = null;
                    if (parent.CategoriaReceitaId.HasValue) catNome = categoriasReceita.FirstOrDefault(c => c.Id == parent.CategoriaReceitaId)?.Nome;
                    else if (parent.CategoriaDespesaId.HasValue) catNome = categoriasDespesa.FirstOrDefault(c => c.Id == parent.CategoriaDespesaId)?.Nome;

                    string? cartaoNome = null;
                    long? cartaoId = null;
                    var faturaId = p.FaturaCartaoId ?? parent.FaturaCartaoId;
                    if (faturaId.HasValue)
                    {
                        var fatura = faturas.FirstOrDefault(f => f.Id == faturaId);
                        if (fatura != null)
                        {
                            var cartao = cartoes.FirstOrDefault(c => c.Id == fatura.CartaoCreditoId);
                            cartaoNome = cartao?.Nome;
                            cartaoId = cartao?.Id;
                        }
                    }

                    response.Add(new LancamentoResponse(
                        p.Id,
                        $"{parent.Descricao} ({p.NumeroParcela}/{p.TotalParcelas})",
                        p.Valor,
                        p.DataVencimento,
                        parent.TipoLancamentoId,
                        parent.CategoriaReceitaId ?? parent.CategoriaDespesaId,
                        catNome,
                        parent.CarteiraId,
                        carteiras.FirstOrDefault(c => c.Id == parent.CarteiraId)?.Nome,
                        cartaoId,
                        cartaoNome,
                        true,
                        p.NumeroParcela,
                        p.TotalParcelas,
                        p.Pago,
                        p.Pago ? "Pago" : "Pendente",
                        true,
                        parent.Id
                    ));
                }

                return Ok(response.OrderBy(r => r.Data));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        public async Task<ActionResult<LancamentoResponse>> Create(CreateLancamentoRequest request)
        {
            try
            {
                var userId = GetUserId();

                var lancamento = new LancamentoFinanceiro
                {
                    UsuarioId = userId,
                    Descricao = request.Descricao,
                    Valor = request.Valor,
                    DataLancamento = request.DataLancamento,
                    TipoLancamentoId = request.TipoLancamentoId,
                    CarteiraId = request.CarteiraId,
                    Fixo = request.Fixo,
                    Efetivada = request.Efetivada,
                    Parcelado = request.Parcelado,
                    CriadoEm = DateTime.UtcNow
                };

                // Handle Credit Card
                if (request.CartaoCreditoId.HasValue)
                {
                    lancamento.FaturaCartaoId = await GetOrCreateFaturaAsync(userId, request.CartaoCreditoId.Value, request.DataLancamento);
                    lancamento.Efetivada = false; // Force false for credit card
                    lancamento.CarteiraId = null; // Card transactions don't point to wallet directly
                }

                // Map Categories
                if (request.TipoLancamentoId == 1) // Receita
                    lancamento.CategoriaReceitaId = request.CategoriaId;
                else
                    lancamento.CategoriaDespesaId = request.CategoriaId;

                if (request.Parcelado)
                {
                    if (!request.TotalParcelas.HasValue || request.TotalParcelas.Value < 1)
                        return BadRequest("TotalParcelas required for parcelado.");

                    lancamento.TotalParcelas = request.TotalParcelas;
                    
                    await _uow.Lancamentos.AddAsync(lancamento);
                    await _uow.CommitAsync(); 

                    decimal valorParcela = request.ModoParcelamento == 2 
                        ? request.Valor 
                        : Math.Round(request.Valor / request.TotalParcelas.Value, 2, MidpointRounding.AwayFromZero);
                        
                    decimal currentTotal = 0;

                    for (int i = 1; i <= request.TotalParcelas.Value; i++)
                    {
                        decimal val = valorParcela;
                        if (request.ModoParcelamento == 1 && i == request.TotalParcelas.Value)
                            val = Math.Round(request.Valor - currentTotal, 2, MidpointRounding.AwayFromZero);
                        
                        currentTotal += val;

                        var parcela = new ParcelaLancamento
                        {
                            LancamentoFinanceiroId = lancamento.Id,
                            NumeroParcela = i,
                            TotalParcelas = request.TotalParcelas.Value,
                            Valor = val,
                            DataVencimento = request.DataLancamento.AddMonths(i - 1),
                            Pago = false,
                            FaturaCartaoId = request.CartaoCreditoId.HasValue 
                                ? await GetOrCreateFaturaAsync(userId, request.CartaoCreditoId.Value, request.DataLancamento.AddMonths(i - 1))
                                : null,
                            CriadoEm = DateTime.UtcNow
                        };
                        await _uow.Parcelas.AddAsync(parcela);
                    }
                    await _uow.CommitAsync();
                }
                else
                {
                    await _uow.Lancamentos.AddAsync(lancamento);
                    await _uow.CommitAsync();
                }

                return CreatedAtAction(nameof(Get), new { mes = request.DataLancamento.Month, ano = request.DataLancamento.Year }, new { id = lancamento.Id });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, UpdateLancamentoRequest request)
        {
            try
            {
                var userId = GetUserId();
                string cleanDesc = System.Text.RegularExpressions.Regex.Replace(request.Descricao, @"\s\(\d+/\d+\)", "").Trim();

                // 1. Try to find if it's a Parcela update first (as most list items are parcelas)
                var parcela = await _uow.Parcelas.GetByIdAsync(id);
                if (parcela != null)
                {
                    var parent = await _uow.Lancamentos.GetByIdAsync(parcela.LancamentoFinanceiroId);
                    if (parent != null && parent.UsuarioId == userId)
                    {
                        if (request.Scope == 1) // Only this
                        {
                            // If description or category changed for "Only this", we should ideally split
                            // but for now let's at least update what we can.
                            // To stay simple and fix the duplicate tag bug:
                            parcela.Pago = parent.FaturaCartaoId.HasValue ? false : request.Efetivada; // Still force false if it belongs to a card
                            parcela.Valor = request.Valor;
                            parcela.DataVencimento = request.DataLancamento;

                            // If date changed and it's a card, we might need to update the Fatura ID?
                            // Yes, for installments it's important.
                            if (parent.FaturaCartaoId.HasValue)
                            {
                                var cartaoId = (await _uow.FaturasCartaoCredito.GetByIdAsync(parcela.FaturaCartaoId ?? 0))?.CartaoCreditoId 
                                            ?? (await _uow.FaturasCartaoCredito.GetByIdAsync(parent.FaturaCartaoId.Value))?.CartaoCreditoId;
                                
                                if (cartaoId.HasValue)
                                {
                                    parcela.FaturaCartaoId = await GetOrCreateFaturaAsync(userId, cartaoId.Value, request.DataLancamento);
                                }
                            }

                            _uow.Parcelas.Update(parcela);
                        }
                        else if (request.Scope == 2 || request.Scope == 3) // Future or All
                        {
                            var allParcelas = await _uow.Parcelas.FindAsync(p => p.LancamentoFinanceiroId == parent.Id);
                            var targetParcelas = request.Scope == 2 
                                ? allParcelas.Where(p => p.NumeroParcela >= parcela.NumeroParcela).ToList()
                                : allParcelas.ToList();

                            if (request.Scope == 2 && parcela.NumeroParcela > 1)
                            {
                                // Split Series: Create new parent for future installments
                                var newParent = new LancamentoFinanceiro
                                {
                                    UsuarioId = userId,
                                    Descricao = cleanDesc,
                                    Valor = request.Valor,
                                    DataLancamento = parent.DataLancamento,
                                    TipoLancamentoId = parent.TipoLancamentoId,
                                    CarteiraId = request.CarteiraId,
                                    FaturaCartaoId = parent.FaturaCartaoId,
                                    CategoriaReceitaId = parent.TipoLancamentoId == 1 ? request.CategoriaId : null,
                                    CategoriaDespesaId = parent.TipoLancamentoId == 2 ? request.CategoriaId : null,
                                    Parcelado = true,
                                    TotalParcelas = parent.TotalParcelas,
                                    Fixo = parent.Fixo,
                                    Efetivada = parent.Efetivada,
                                    CriadoEm = DateTime.UtcNow
                                };
                                
                                await _uow.Lancamentos.AddAsync(newParent);
                                await _uow.CommitAsync();

                                foreach (var p in targetParcelas)
                                {
                                    p.LancamentoFinanceiroId = newParent.Id;
                                    p.Valor = request.Valor;
                                    _uow.Parcelas.Update(p);
                                }
                            }
                            else
                            {
                                // All or Future starting from 1st
                                foreach (var p in targetParcelas)
                                {
                                    p.Valor = request.Valor;
                                    _uow.Parcelas.Update(p);
                                }
                                
                                parent.Descricao = cleanDesc;
                                parent.CategoriaReceitaId = parent.TipoLancamentoId == 1 ? request.CategoriaId : null;
                                parent.CategoriaDespesaId = parent.TipoLancamentoId == 2 ? request.CategoriaId : null;
                                parent.CarteiraId = request.CarteiraId;
                                _uow.Lancamentos.Update(parent);
                            }
                        }
                        
                        await _uow.CommitAsync();
                        return NoContent();
                    }
                }

                // 2. Fallback to normal Lancamento update
                var lancamento = await _uow.Lancamentos.GetByIdAsync(id);
                if (lancamento == null || lancamento.UsuarioId != userId)
                {
                    return NotFound();
                }

                lancamento.Descricao = cleanDesc;
                lancamento.Valor = request.Valor;
                lancamento.DataLancamento = request.DataLancamento;
                lancamento.Fixo = request.Fixo;
                lancamento.Efetivada = request.Efetivada;

                if (lancamento.TipoLancamentoId == 1) // Receita
                {
                    lancamento.CategoriaReceitaId = request.CategoriaId;
                    lancamento.CategoriaDespesaId = null;
                }
                else
                {
                    lancamento.CategoriaDespesaId = request.CategoriaId;
                    lancamento.CategoriaReceitaId = null;
                }

                if (request.CartaoCreditoId.HasValue)
                {
                    lancamento.CarteiraId = null;
                    var mes = request.DataLancamento.Month;
                    var ano = request.DataLancamento.Year;
                    var competencias = await _uow.Competencias.FindAsync(c => c.UsuarioId == userId && c.Mes == mes && c.Exercicio == ano);
                    var competencia = competencias.FirstOrDefault() ?? new Competencia { UsuarioId = userId, Mes = mes, Exercicio = ano, CriadoEm = DateTime.UtcNow };
                    
                    if (competencia.Id == 0)
                    {
                        await _uow.Competencias.AddAsync(competencia);
                        await _uow.CommitAsync();
                    }

                    var faturas = await _uow.FaturasCartaoCredito.FindAsync(f => f.UsuarioId == userId && f.CartaoCreditoId == request.CartaoCreditoId && f.CompetenciaId == competencia.Id);
                    var fatura = faturas.FirstOrDefault() ?? new FaturaCartaoCredito 
                    { 
                        UsuarioId = userId, 
                        CartaoCreditoId = request.CartaoCreditoId.Value, 
                        CompetenciaId = competencia.Id,
                        Valor = 0,
                        Fechada = false,
                        CriadoEm = DateTime.UtcNow 
                    };

                    if (fatura.Id == 0)
                    {
                        await _uow.FaturasCartaoCredito.AddAsync(fatura);
                        await _uow.CommitAsync();
                    }
                    lancamento.FaturaCartaoId = fatura.Id;
                    lancamento.Efetivada = false; // Enforce for card
                }
                else
                {
                    lancamento.CarteiraId = request.CarteiraId;
                    lancamento.FaturaCartaoId = null;
                }

                _uow.Lancamentos.Update(lancamento);
                await _uow.CommitAsync();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id, [FromQuery] int scope = 1)
        {
             try
            {
                var userId = GetUserId();

                // 1. Try Parcela first
                var parcela = await _uow.Parcelas.GetByIdAsync(id);
                if (parcela != null)
                {
                    var parent = await _uow.Lancamentos.GetByIdAsync(parcela.LancamentoFinanceiroId);
                    if (parent != null && parent.UsuarioId == userId)
                    {
                        if (scope == 1) // Only this
                        {
                            _uow.Parcelas.Delete(parcela);
                        }
                        else if (scope == 2 || scope == 3) // Future or All
                        {
                            var allParcelas = await _uow.Parcelas.FindAsync(p => p.LancamentoFinanceiroId == parent.Id);
                            var targetParcelas = scope == 2 
                                ? allParcelas.Where(p => p.NumeroParcela >= parcela.NumeroParcela).ToList()
                                : allParcelas.ToList();

                            foreach (var p in targetParcelas)
                            {
                                _uow.Parcelas.Delete(p);
                            }

                            if (scope == 3 || !allParcelas.Any(p => p.NumeroParcela < parcela.NumeroParcela))
                            {
                                _uow.Lancamentos.Delete(parent);
                            }
                        }
                        await _uow.CommitAsync();
                        return NoContent();
                    }
                }

                // 2. Fallback to normal Lancamento
                var lancamento = await _uow.Lancamentos.GetByIdAsync(id);
                if (lancamento != null && lancamento.UsuarioId == userId)
                {
                    _uow.Lancamentos.Delete(lancamento);
                    await _uow.CommitAsync();
                    return NoContent();
                }

                return NotFound();
            }
             catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
