using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyFinance.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "banco",
                columns: table => new
                {
                    id_banco = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    codigo_banco = table.Column<string>(type: "text", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_banco", x => x.id_banco);
                });

            migrationBuilder.CreateTable(
                name: "tipo_carteira",
                columns: table => new
                {
                    id_tipo_carteira = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tipo_carteira", x => x.id_tipo_carteira);
                });

            migrationBuilder.CreateTable(
                name: "tipo_lancamento_financeiro",
                columns: table => new
                {
                    id_tipo_lancamento_financeiro = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tipo_lancamento_financeiro", x => x.id_tipo_lancamento_financeiro);
                });

            migrationBuilder.CreateTable(
                name: "tipo_transferencia_financeira",
                columns: table => new
                {
                    id_tipo_transferencia_financeira = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tipo_transferencia_financeira", x => x.id_tipo_transferencia_financeira);
                });

            migrationBuilder.CreateTable(
                name: "usuario",
                columns: table => new
                {
                    id_usuario = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email = table.Column<string>(type: "text", nullable: false),
                    login = table.Column<string>(type: "text", nullable: false),
                    senha = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    nivel = table.Column<string>(type: "text", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_usuario", x => x.id_usuario);
                });

            migrationBuilder.CreateTable(
                name: "alerta_financeiro",
                columns: table => new
                {
                    id_alerta_financeiro = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    tipo_alerta = table.Column<string>(type: "text", nullable: false),
                    mensagem = table.Column<string>(type: "text", nullable: false),
                    data_alerta = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fl_lido = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_alerta_financeiro", x => x.id_alerta_financeiro);
                    table.ForeignKey(
                        name: "fk_alerta_financeiro_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cartao_credito",
                columns: table => new
                {
                    id_cartao_credito = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_banco = table.Column<long>(type: "bigint", nullable: true),
                    nome = table.Column<string>(type: "text", nullable: false),
                    limite_total = table.Column<decimal>(type: "numeric", nullable: false),
                    limite_atual = table.Column<decimal>(type: "numeric", nullable: false),
                    fl_cartao_credito_ativo = table.Column<bool>(type: "boolean", nullable: false),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cartao_credito", x => x.id_cartao_credito);
                    table.ForeignKey(
                        name: "fk_cartao_credito_banco_id_banco",
                        column: x => x.id_banco,
                        principalTable: "banco",
                        principalColumn: "id_banco");
                    table.ForeignKey(
                        name: "fk_cartao_credito_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "carteira",
                columns: table => new
                {
                    id_carteira = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_banco = table.Column<long>(type: "bigint", nullable: true),
                    nome = table.Column<string>(type: "text", nullable: false),
                    id_tipo_carteira = table.Column<long>(type: "bigint", nullable: false),
                    saldo_inicial = table.Column<decimal>(type: "numeric", nullable: false),
                    saldo_atual = table.Column<decimal>(type: "numeric", nullable: false),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_carteira", x => x.id_carteira);
                    table.ForeignKey(
                        name: "fk_carteira_banco_id_banco",
                        column: x => x.id_banco,
                        principalTable: "banco",
                        principalColumn: "id_banco");
                    table.ForeignKey(
                        name: "fk_carteira_tipo_carteira_id_tipo_carteira",
                        column: x => x.id_tipo_carteira,
                        principalTable: "tipo_carteira",
                        principalColumn: "id_tipo_carteira",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_carteira_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "categoria_despesa",
                columns: table => new
                {
                    id_categoria_despesa = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    fl_fixo = table.Column<bool>(type: "boolean", nullable: false),
                    valor_fixo_categoria_despesa = table.Column<decimal>(type: "numeric", nullable: false),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categoria_despesa", x => x.id_categoria_despesa);
                    table.ForeignKey(
                        name: "fk_categoria_despesa_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "categoria_receita",
                columns: table => new
                {
                    id_categoria_receita = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "text", nullable: false),
                    fl_fixo = table.Column<bool>(type: "boolean", nullable: false),
                    valor_fixo_categoria_receita = table.Column<decimal>(type: "numeric", nullable: false),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categoria_receita", x => x.id_categoria_receita);
                    table.ForeignKey(
                        name: "fk_categoria_receita_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "competencia",
                columns: table => new
                {
                    id_competencia = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    mes = table.Column<int>(type: "integer", nullable: false),
                    exercicio = table.Column<int>(type: "integer", nullable: false),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_competencia", x => x.id_competencia);
                    table.ForeignKey(
                        name: "fk_competencia_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "investimento",
                columns: table => new
                {
                    id_investimento = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    nome = table.Column<string>(type: "text", nullable: false),
                    tipo = table.Column<string>(type: "text", nullable: false),
                    valor_inicial = table.Column<decimal>(type: "numeric", nullable: false),
                    valor_atual = table.Column<decimal>(type: "numeric", nullable: false),
                    data_inicio = table.Column<DateOnly>(type: "date", nullable: false),
                    data_resgate = table.Column<DateOnly>(type: "date", nullable: true),
                    rendimento_percentual = table.Column<decimal>(type: "numeric", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_investimento", x => x.id_investimento);
                    table.ForeignKey(
                        name: "fk_investimento_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "meta_financeira",
                columns: table => new
                {
                    id_meta_financeira = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    nome = table.Column<string>(type: "text", nullable: false),
                    descricao = table.Column<string>(type: "text", nullable: true),
                    valor_meta = table.Column<decimal>(type: "numeric", nullable: false),
                    valor_atual = table.Column<decimal>(type: "numeric", nullable: false),
                    data_inicio = table.Column<DateOnly>(type: "date", nullable: false),
                    data_fim = table.Column<DateOnly>(type: "date", nullable: true),
                    fl_atingida = table.Column<bool>(type: "boolean", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_meta_financeira", x => x.id_meta_financeira);
                    table.ForeignKey(
                        name: "fk_meta_financeira_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "transferencia_financeira",
                columns: table => new
                {
                    id_transferencia_financeira = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_tipo_transferencia_financeira = table.Column<long>(type: "bigint", nullable: false),
                    data_transferencia = table.Column<DateOnly>(type: "date", nullable: false),
                    descricao_transferencia = table.Column<string>(type: "text", nullable: false),
                    valor_transferencia = table.Column<decimal>(type: "numeric", nullable: false),
                    id_carteira_origem = table.Column<long>(type: "bigint", nullable: true),
                    id_carteira_destino = table.Column<long>(type: "bigint", nullable: true),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_transferencia_financeira", x => x.id_transferencia_financeira);
                    table.ForeignKey(
                        name: "fk_transferencia_financeira_carteira_id_carteira_destino",
                        column: x => x.id_carteira_destino,
                        principalTable: "carteira",
                        principalColumn: "id_carteira");
                    table.ForeignKey(
                        name: "fk_transferencia_financeira_carteira_id_carteira_origem",
                        column: x => x.id_carteira_origem,
                        principalTable: "carteira",
                        principalColumn: "id_carteira");
                    table.ForeignKey(
                        name: "fk_transferencia_financeira_tipo_transferencia_financeira_id_t",
                        column: x => x.id_tipo_transferencia_financeira,
                        principalTable: "tipo_transferencia_financeira",
                        principalColumn: "id_tipo_transferencia_financeira",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_transferencia_financeira_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fatura_cartao_credito",
                columns: table => new
                {
                    id_fatura_cartao_credito = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_cartao_credito = table.Column<long>(type: "bigint", nullable: false),
                    id_competencia = table.Column<long>(type: "bigint", nullable: false),
                    valor_fatura_cartao_credito = table.Column<decimal>(type: "numeric", nullable: false),
                    fl_fatura_cartao_credito_fechada = table.Column<bool>(type: "boolean", nullable: false),
                    data_fechamento_fatura_cartao_credito = table.Column<DateOnly>(type: "date", nullable: true),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fatura_cartao_credito", x => x.id_fatura_cartao_credito);
                    table.ForeignKey(
                        name: "fk_fatura_cartao_credito_cartao_credito_id_cartao_credito",
                        column: x => x.id_cartao_credito,
                        principalTable: "cartao_credito",
                        principalColumn: "id_cartao_credito",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_fatura_cartao_credito_competencia_id_competencia",
                        column: x => x.id_competencia,
                        principalTable: "competencia",
                        principalColumn: "id_competencia",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_fatura_cartao_credito_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "lancamento_financeiro",
                columns: table => new
                {
                    id_lancamento_financeiro = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<long>(type: "bigint", nullable: false),
                    data_lancamento_financeiro = table.Column<DateOnly>(type: "date", nullable: false),
                    id_tipo_lancamento_financeiro = table.Column<long>(type: "bigint", nullable: false),
                    id_competencia = table.Column<long>(type: "bigint", nullable: true),
                    id_fatura_cartao_credito = table.Column<long>(type: "bigint", nullable: true),
                    id_carteira = table.Column<long>(type: "bigint", nullable: true),
                    id_categoria_receita = table.Column<long>(type: "bigint", nullable: true),
                    id_categoria_despesa = table.Column<long>(type: "bigint", nullable: true),
                    id_transferencia_financeira = table.Column<long>(type: "bigint", nullable: true),
                    descricao = table.Column<string>(type: "text", nullable: false),
                    valor_lancamento_financeiro = table.Column<decimal>(type: "numeric", nullable: false),
                    fl_parcelado = table.Column<bool>(type: "boolean", nullable: false),
                    numero_parcela = table.Column<int>(type: "integer", nullable: true),
                    total_parcelas = table.Column<int>(type: "integer", nullable: true),
                    fl_fixo = table.Column<bool>(type: "boolean", nullable: false),
                    fl_efetivada = table.Column<bool>(type: "boolean", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lancamento_financeiro", x => x.id_lancamento_financeiro);
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_carteira_id_carteira",
                        column: x => x.id_carteira,
                        principalTable: "carteira",
                        principalColumn: "id_carteira");
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_categoria_despesa_id_categoria_despesa",
                        column: x => x.id_categoria_despesa,
                        principalTable: "categoria_despesa",
                        principalColumn: "id_categoria_despesa");
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_categoria_receita_id_categoria_receita",
                        column: x => x.id_categoria_receita,
                        principalTable: "categoria_receita",
                        principalColumn: "id_categoria_receita");
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_competencia_id_competencia",
                        column: x => x.id_competencia,
                        principalTable: "competencia",
                        principalColumn: "id_competencia");
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_fatura_cartao_credito_id_fatura_carta",
                        column: x => x.id_fatura_cartao_credito,
                        principalTable: "fatura_cartao_credito",
                        principalColumn: "id_fatura_cartao_credito");
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_tipo_lancamento_financeiro_id_tipo_la",
                        column: x => x.id_tipo_lancamento_financeiro,
                        principalTable: "tipo_lancamento_financeiro",
                        principalColumn: "id_tipo_lancamento_financeiro",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_transferencia_financeira_id_transfere",
                        column: x => x.id_transferencia_financeira,
                        principalTable: "transferencia_financeira",
                        principalColumn: "id_transferencia_financeira");
                    table.ForeignKey(
                        name: "fk_lancamento_financeiro_usuario_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuario",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "parcela_lancamento",
                columns: table => new
                {
                    id_parcela_lancamento = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_lancamento_financeiro = table.Column<long>(type: "bigint", nullable: false),
                    numero_parcela = table.Column<int>(type: "integer", nullable: false),
                    total_parcelas = table.Column<int>(type: "integer", nullable: false),
                    valor_parcela = table.Column<decimal>(type: "numeric", nullable: false),
                    data_vencimento = table.Column<DateOnly>(type: "date", nullable: false),
                    fl_pago = table.Column<bool>(type: "boolean", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_parcela_lancamento", x => x.id_parcela_lancamento);
                    table.ForeignKey(
                        name: "fk_parcela_lancamento_lancamento_financeiro_id_lancamento_fina",
                        column: x => x.id_lancamento_financeiro,
                        principalTable: "lancamento_financeiro",
                        principalColumn: "id_lancamento_financeiro",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_alerta_financeiro_id_usuario",
                table: "alerta_financeiro",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_cartao_credito_id_banco",
                table: "cartao_credito",
                column: "id_banco");

            migrationBuilder.CreateIndex(
                name: "ix_cartao_credito_id_usuario",
                table: "cartao_credito",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_carteira_id_banco",
                table: "carteira",
                column: "id_banco");

            migrationBuilder.CreateIndex(
                name: "ix_carteira_id_tipo_carteira",
                table: "carteira",
                column: "id_tipo_carteira");

            migrationBuilder.CreateIndex(
                name: "ix_carteira_id_usuario",
                table: "carteira",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_categoria_despesa_id_usuario",
                table: "categoria_despesa",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_categoria_despesa_nome_id_usuario",
                table: "categoria_despesa",
                columns: new[] { "nome", "id_usuario" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_categoria_receita_id_usuario",
                table: "categoria_receita",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_categoria_receita_nome_id_usuario",
                table: "categoria_receita",
                columns: new[] { "nome", "id_usuario" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_competencia_id_usuario",
                table: "competencia",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_competencia_mes_exercicio_id_usuario",
                table: "competencia",
                columns: new[] { "mes", "exercicio", "id_usuario" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_fatura_cartao_credito_id_cartao_credito",
                table: "fatura_cartao_credito",
                column: "id_cartao_credito");

            migrationBuilder.CreateIndex(
                name: "ix_fatura_cartao_credito_id_competencia",
                table: "fatura_cartao_credito",
                column: "id_competencia");

            migrationBuilder.CreateIndex(
                name: "ix_fatura_cartao_credito_id_usuario",
                table: "fatura_cartao_credito",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_investimento_id_usuario",
                table: "investimento",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_carteira",
                table: "lancamento_financeiro",
                column: "id_carteira");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_categoria_despesa",
                table: "lancamento_financeiro",
                column: "id_categoria_despesa");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_categoria_receita",
                table: "lancamento_financeiro",
                column: "id_categoria_receita");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_competencia",
                table: "lancamento_financeiro",
                column: "id_competencia");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_fatura_cartao_credito",
                table: "lancamento_financeiro",
                column: "id_fatura_cartao_credito");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_tipo_lancamento_financeiro",
                table: "lancamento_financeiro",
                column: "id_tipo_lancamento_financeiro");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_transferencia_financeira",
                table: "lancamento_financeiro",
                column: "id_transferencia_financeira");

            migrationBuilder.CreateIndex(
                name: "ix_lancamento_financeiro_id_usuario",
                table: "lancamento_financeiro",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_meta_financeira_id_usuario",
                table: "meta_financeira",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_parcela_lancamento_id_lancamento_financeiro",
                table: "parcela_lancamento",
                column: "id_lancamento_financeiro");

            migrationBuilder.CreateIndex(
                name: "ix_transferencia_financeira_id_carteira_destino",
                table: "transferencia_financeira",
                column: "id_carteira_destino");

            migrationBuilder.CreateIndex(
                name: "ix_transferencia_financeira_id_carteira_origem",
                table: "transferencia_financeira",
                column: "id_carteira_origem");

            migrationBuilder.CreateIndex(
                name: "ix_transferencia_financeira_id_tipo_transferencia_financeira",
                table: "transferencia_financeira",
                column: "id_tipo_transferencia_financeira");

            migrationBuilder.CreateIndex(
                name: "ix_transferencia_financeira_id_usuario",
                table: "transferencia_financeira",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "ix_usuario_email",
                table: "usuario",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_usuario_login",
                table: "usuario",
                column: "login",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alerta_financeiro");

            migrationBuilder.DropTable(
                name: "investimento");

            migrationBuilder.DropTable(
                name: "meta_financeira");

            migrationBuilder.DropTable(
                name: "parcela_lancamento");

            migrationBuilder.DropTable(
                name: "lancamento_financeiro");

            migrationBuilder.DropTable(
                name: "categoria_despesa");

            migrationBuilder.DropTable(
                name: "categoria_receita");

            migrationBuilder.DropTable(
                name: "fatura_cartao_credito");

            migrationBuilder.DropTable(
                name: "tipo_lancamento_financeiro");

            migrationBuilder.DropTable(
                name: "transferencia_financeira");

            migrationBuilder.DropTable(
                name: "cartao_credito");

            migrationBuilder.DropTable(
                name: "competencia");

            migrationBuilder.DropTable(
                name: "carteira");

            migrationBuilder.DropTable(
                name: "tipo_transferencia_financeira");

            migrationBuilder.DropTable(
                name: "banco");

            migrationBuilder.DropTable(
                name: "tipo_carteira");

            migrationBuilder.DropTable(
                name: "usuario");
        }
    }
}
