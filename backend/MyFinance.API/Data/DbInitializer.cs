using Microsoft.EntityFrameworkCore;
using MyFinance.API.Models;

namespace MyFinance.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(MyFinanceDbContext context)
        {
            // Hotfix: Ensure table schema is up to date
            try
            {
                context.Database.ExecuteSqlRaw("ALTER TABLE usuario ALTER COLUMN senha TYPE varchar(255);");
                context.Database.ExecuteSqlRaw("ALTER TABLE usuario ADD COLUMN IF NOT EXISTS refresh_token text;");
                context.Database.ExecuteSqlRaw("ALTER TABLE usuario ADD COLUMN IF NOT EXISTS refresh_token_expiration timestamp with time zone;");
                
                // Add credit card invoice management columns
                context.Database.ExecuteSqlRaw("ALTER TABLE parcela_lancamento ADD COLUMN IF NOT EXISTS id_fatura_cartao_credito bigint;");
                context.Database.ExecuteSqlRaw("ALTER TABLE cartao_credito ADD COLUMN IF NOT EXISTS id_carteira bigint;");
                context.Database.ExecuteSqlRaw("ALTER TABLE cartao_credito ADD COLUMN IF NOT EXISTS dia_fechamento_fatura integer NOT NULL DEFAULT 1;");
                context.Database.ExecuteSqlRaw("ALTER TABLE cartao_credito ADD COLUMN IF NOT EXISTS dia_vencimento_fatura integer NOT NULL DEFAULT 1;");
                
                // Add foreign key constraints if they don't exist
                context.Database.ExecuteSqlRaw(@"
                    DO $$ 
                    BEGIN
                        IF NOT EXISTS (
                            SELECT 1 FROM pg_constraint 
                            WHERE conname = 'fk_parcela_lancamento_fatura_cartao_credito'
                        ) THEN
                            ALTER TABLE parcela_lancamento 
                            ADD CONSTRAINT fk_parcela_lancamento_fatura_cartao_credito 
                            FOREIGN KEY (id_fatura_cartao_credito) 
                            REFERENCES fatura_cartao_credito(id_fatura_cartao_credito);
                        END IF;
                    END $$;
                ");
                
                context.Database.ExecuteSqlRaw(@"
                    DO $$ 
                    BEGIN
                        IF NOT EXISTS (
                            SELECT 1 FROM pg_constraint 
                            WHERE conname = 'fk_cartao_credito_carteira'
                        ) THEN
                            ALTER TABLE cartao_credito 
                            ADD CONSTRAINT fk_cartao_credito_carteira 
                            FOREIGN KEY (id_carteira) 
                            REFERENCES carteira(id_carteira);
                        END IF;
                    END $$;
                ");
                
                // Add indexes
                context.Database.ExecuteSqlRaw(@"
                    CREATE INDEX IF NOT EXISTS ix_parcela_lancamento_id_fatura_cartao_credito 
                    ON parcela_lancamento(id_fatura_cartao_credito);
                ");
                
                context.Database.ExecuteSqlRaw(@"
                    CREATE INDEX IF NOT EXISTS ix_cartao_credito_id_carteira 
                    ON cartao_credito(id_carteira);
                ");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error patching schema: {ex.Message}");
            }

            if (context.Bancos.Any())
            {
                return;   // DB has been seeded
            }

            var bancos = new Banco[]
            {
                new Banco { Nome = "Banco do Brasil", Codigo = "001", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Caixa Econômica Federal", Codigo = "104", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Bradesco", Codigo = "237", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Itaú Unibanco", Codigo = "341", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Santander", Codigo = "033", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Nubank", Codigo = "260", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Banco Inter", Codigo = "077", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "C6 Bank", Codigo = "336", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "BTG Pactual", Codigo = "208", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "PagBank", Codigo = "290", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Banco Pan", Codigo = "623", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Banco Original", Codigo = "212", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Neon", Codigo = "735", CriadoEm = DateTime.UtcNow },
                new Banco { Nome = "Outros", Codigo = "999", CriadoEm = DateTime.UtcNow }
            };

            context.Bancos.AddRange(bancos);

            var tiposCarteira = new TipoCarteira[]
            {
                new TipoCarteira { Nome = "Conta Corrente", CriadoEm = DateTime.UtcNow },
                new TipoCarteira { Nome = "Conta Poupança", CriadoEm = DateTime.UtcNow },
                new TipoCarteira { Nome = "Investimento", CriadoEm = DateTime.UtcNow },
                new TipoCarteira { Nome = "Dinheiro", CriadoEm = DateTime.UtcNow },
                new TipoCarteira { Nome = "Vale Alimentação/Refeição", CriadoEm = DateTime.UtcNow },
                new TipoCarteira { Nome = "Outros", CriadoEm = DateTime.UtcNow }
            };
            context.TiposCarteira.AddRange(tiposCarteira);

            var tiposLancamento = new TipoLancamentoFinanceiro[]
            {
                new TipoLancamentoFinanceiro { Nome = "Receita", CriadoEm = DateTime.UtcNow },
                new TipoLancamentoFinanceiro { Nome = "Despesa", CriadoEm = DateTime.UtcNow }
            };
            context.TiposLancamento.AddRange(tiposLancamento);

            var tiposTransferencia = new TipoTransferenciaFinanceira[]
            {
                new TipoTransferenciaFinanceira { Nome = "Transferência", CriadoEm = DateTime.UtcNow }
            };
            context.TiposTransferencia.AddRange(tiposTransferencia);

            context.SaveChanges();
        }
    }
}
