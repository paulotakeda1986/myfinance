using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.Models;
using MyFinance.API.Repositories;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DominioController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public DominioController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet("bancos")]
        public async Task<ActionResult<IEnumerable<Banco>>> GetBancos()
        {
            var bancos = await _uow.Bancos.GetAllAsync();
            return Ok(bancos);
        }

        [HttpGet("tipos-carteira")]
        public async Task<ActionResult<IEnumerable<TipoCarteira>>> GetTiposCarteira()
        {
            var tipos = await _uow.TiposCarteira.GetAllAsync();
            return Ok(tipos);
        }

        [HttpGet("tipos-lancamento")]
        public async Task<ActionResult<IEnumerable<TipoLancamentoFinanceiro>>> GetTiposLancamento()
        {
            var tipos = await _uow.TiposLancamento.GetAllAsync();
            return Ok(tipos);
        }

        [HttpGet("tipos-transferencia")]
        public async Task<ActionResult<IEnumerable<TipoTransferenciaFinanceira>>> GetTiposTransferencia()
        {
            var tipos = await _uow.TiposTransferencia.GetAllAsync();
            return Ok(tipos);
        }
    }
}
