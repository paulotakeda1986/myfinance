using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.DTOs.CartaoCredito;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartaoCreditoController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public CartaoCreditoController(IUnitOfWork uow)
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
        public async Task<ActionResult<IEnumerable<CartaoCreditoResponse>>> Get()
        {
            try
            {
                var userId = GetUserId();
                var cartoes = await _uow.CartoesCredito.FindAsync(c => c.UsuarioId == userId);
                var carteiras = await _uow.Carteiras.FindAsync(c => c.UsuarioId == userId);
                var bancos = await _uow.Bancos.GetAllAsync();
                
                var response = cartoes.Select(c => new CartaoCreditoResponse(
                    c.Id,
                    c.Nome,
                    c.BancoId,
                    bancos.FirstOrDefault(b => b.Id == c.BancoId)?.Nome,
                    c.CarteiraId,
                    carteiras.FirstOrDefault(w => w.Id == c.CarteiraId)?.Nome,
                    c.LimiteTotal,
                    c.LimiteAtual,
                    c.Ativo
                ));

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartaoCreditoResponse>> Get(long id)
        {
            try
            {
                var userId = GetUserId();
                var cartao = await _uow.CartoesCredito.GetByIdAsync(id);

                if (cartao == null || cartao.UsuarioId != userId)
                {
                    return NotFound();
                }

                var bancos = await _uow.Bancos.GetAllAsync();

                var response = new CartaoCreditoResponse(
                    cartao.Id,
                    cartao.Nome,
                    cartao.BancoId,
                    bancos.FirstOrDefault(b => b.Id == cartao.BancoId)?.Nome,
                    cartao.CarteiraId,
                    (await _uow.Carteiras.GetByIdAsync(cartao.CarteiraId ?? 0))?.Nome,
                    cartao.LimiteTotal,
                    cartao.LimiteAtual,
                    cartao.Ativo
                );

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        public async Task<ActionResult<CartaoCreditoResponse>> Create(CreateCartaoCreditoRequest request)
        {
            try
            {
                var userId = GetUserId();

                if (request.BancoId.HasValue)
                {
                    var banco = await _uow.Bancos.GetByIdAsync(request.BancoId.Value);
                    if (banco == null) return BadRequest("Banco invalid");
                }

                var cartao = new CartaoCredito
                {
                    Nome = request.Nome,
                    BancoId = request.BancoId,
                    CarteiraId = request.CarteiraId,
                    LimiteTotal = request.LimiteTotal,
                    LimiteAtual = request.LimiteTotal, // Starts with full limit
                    UsuarioId = userId,
                    Ativo = true,
                    CriadoEm = DateTime.UtcNow
                };

                await _uow.CartoesCredito.AddAsync(cartao);
                await _uow.CommitAsync();

                var bancos = await _uow.Bancos.GetAllAsync();

                return CreatedAtAction(nameof(Get), new { id = cartao.Id }, new CartaoCreditoResponse(
                    cartao.Id,
                    cartao.Nome,
                    cartao.BancoId,
                    bancos.FirstOrDefault(b => b.Id == cartao.BancoId)?.Nome,
                    cartao.CarteiraId,
                    (await _uow.Carteiras.GetByIdAsync(cartao.CarteiraId ?? 0))?.Nome,
                    cartao.LimiteTotal,
                    cartao.LimiteAtual,
                    cartao.Ativo
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, UpdateCartaoCreditoRequest request)
        {
            try
            {
                var userId = GetUserId();
                var cartao = await _uow.CartoesCredito.GetByIdAsync(id);

                if (cartao == null || cartao.UsuarioId != userId)
                {
                    return NotFound();
                }

                if (request.BancoId.HasValue)
                {
                    var banco = await _uow.Bancos.GetByIdAsync(request.BancoId.Value);
                    if (banco == null) return BadRequest("Banco invalid");
                }

                // If limit total changes, we might want to adjust LimitAtual accordingly?
                // For simplicity, let's keep it basic or just update basic fields.
                cartao.Nome = request.Nome;
                cartao.BancoId = request.BancoId;
                cartao.LimiteTotal = request.LimiteTotal;
                cartao.Ativo = request.Ativo;
                cartao.CarteiraId = request.CarteiraId;

                _uow.CartoesCredito.Update(cartao);
                await _uow.CommitAsync();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var userId = GetUserId();
                var cartao = await _uow.CartoesCredito.GetByIdAsync(id);

                if (cartao == null || cartao.UsuarioId != userId)
                {
                    return NotFound();
                }

                _uow.CartoesCredito.Delete(cartao);
                await _uow.CommitAsync();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
