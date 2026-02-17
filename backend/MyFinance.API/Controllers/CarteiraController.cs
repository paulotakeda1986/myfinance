using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.DTOs.Carteira;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CarteiraController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public CarteiraController(IUnitOfWork uow)
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
        public async Task<ActionResult<IEnumerable<CarteiraResponse>>> Get()
        {
            try
            {
                var userId = GetUserId();
                var carteiras = await _uow.Carteiras.FindAsync(c => c.UsuarioId == userId);
                
                // Note: To get related data (Banco, TipoCarteira) efficiently, we might need Includes in Repository
                // For now, let's return what we have, or better, fetch them if needed. 
                // The generic repository might not support Include easily without modification. 
                // Let's assume for now we just return IDs or basic info. 
                // To do it properly, I'd need to modify Repository to support includes or explicit loading.
                // Given the generic repository IRepostiory<T>, I can't easily include.
                // However, I can fetch all types and banks and map them in memory if the list is small (it usually is for reference data).
                // Or I can add a specific method to ICarteiraRepository later. 
                // For MVP, I'll fetch related entities or just return IDs. 
                // Let's check if I can get standard descriptions.
                
                // Quick workaround for MVP: Load reference data in memory (caching candidate)
                var bancos = await _uow.Bancos.GetAllAsync();
                var tipos = await _uow.TiposCarteira.GetAllAsync();

                var response = carteiras.Select(c => new CarteiraResponse(
                    c.Id,
                    c.Nome,
                    c.BancoId,
                    bancos.FirstOrDefault(b => b.Id == c.BancoId)?.Nome,
                    c.TipoCarteiraId,
                    tipos.FirstOrDefault(t => t.Id == c.TipoCarteiraId)?.Nome,
                    c.SaldoInicial,
                    c.SaldoAtual
                ));

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CarteiraResponse>> Get(long id)
        {
            try
            {
                var userId = GetUserId();
                var carteira = await _uow.Carteiras.GetByIdAsync(id);

                if (carteira == null || carteira.UsuarioId != userId)
                {
                    return NotFound();
                }

                var bancos = await _uow.Bancos.GetAllAsync();
                var tipos = await _uow.TiposCarteira.GetAllAsync();

                var response = new CarteiraResponse(
                    carteira.Id,
                    carteira.Nome,
                    carteira.BancoId,
                    bancos.FirstOrDefault(b => b.Id == carteira.BancoId)?.Nome,
                    carteira.TipoCarteiraId,
                    tipos.FirstOrDefault(t => t.Id == carteira.TipoCarteiraId)?.Nome,
                    carteira.SaldoInicial,
                    carteira.SaldoAtual
                );

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        public async Task<ActionResult<CarteiraResponse>> Create(CreateCarteiraRequest request)
        {
            try
            {
                var userId = GetUserId();

                // Validate references
                var tipo = await _uow.TiposCarteira.GetByIdAsync(request.TipoCarteiraId);
                if (tipo == null) return BadRequest("TipoCarteira invalid");

                if (request.BancoId.HasValue)
                {
                    var banco = await _uow.Bancos.GetByIdAsync(request.BancoId.Value);
                    if (banco == null) return BadRequest("Banco invalid");
                }

                var carteira = new Carteira
                {
                    Nome = request.Nome,
                    BancoId = request.BancoId,
                    TipoCarteiraId = request.TipoCarteiraId,
                    SaldoInicial = request.SaldoInicial,
                    SaldoAtual = request.SaldoInicial, // Initial balance sets current balance
                    UsuarioId = userId,
                    CriadoEm = DateTime.UtcNow
                };

                await _uow.Carteiras.AddAsync(carteira);
                await _uow.CommitAsync();

                return CreatedAtAction(nameof(Get), new { id = carteira.Id }, new CarteiraResponse(
                    carteira.Id,
                    carteira.Nome,
                    carteira.BancoId,
                    null, // Client can refetch or we can look it up
                    carteira.TipoCarteiraId,
                    tipo.Nome,
                    carteira.SaldoInicial,
                    carteira.SaldoAtual
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, UpdateCarteiraRequest request)
        {
            try
            {
                var userId = GetUserId();
                var carteira = await _uow.Carteiras.GetByIdAsync(id);

                if (carteira == null || carteira.UsuarioId != userId)
                {
                    return NotFound();
                }

                 // Validate references
                var tipo = await _uow.TiposCarteira.GetByIdAsync(request.TipoCarteiraId);
                if (tipo == null) return BadRequest("TipoCarteira invalid");

                if (request.BancoId.HasValue)
                {
                    var banco = await _uow.Bancos.GetByIdAsync(request.BancoId.Value);
                    if (banco == null) return BadRequest("Banco invalid");
                }

                carteira.Nome = request.Nome;
                carteira.BancoId = request.BancoId;
                carteira.TipoCarteiraId = request.TipoCarteiraId;

                _uow.Carteiras.Update(carteira);
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
                var carteira = await _uow.Carteiras.GetByIdAsync(id);

                if (carteira == null || carteira.UsuarioId != userId)
                {
                    return NotFound();
                }

                _uow.Carteiras.Delete(carteira);
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
