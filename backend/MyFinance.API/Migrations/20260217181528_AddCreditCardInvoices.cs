using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyFinance.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCreditCardInvoices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "senha",
                table: "usuario",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "refresh_token",
                table: "usuario",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "refresh_token_expiration",
                table: "usuario",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "id_fatura_cartao_credito",
                table: "parcela_lancamento",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "id_carteira",
                table: "cartao_credito",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_parcela_lancamento_id_fatura_cartao_credito",
                table: "parcela_lancamento",
                column: "id_fatura_cartao_credito");

            migrationBuilder.CreateIndex(
                name: "ix_cartao_credito_id_carteira",
                table: "cartao_credito",
                column: "id_carteira");

            migrationBuilder.AddForeignKey(
                name: "fk_cartao_credito_carteira_id_carteira",
                table: "cartao_credito",
                column: "id_carteira",
                principalTable: "carteira",
                principalColumn: "id_carteira");

            migrationBuilder.AddForeignKey(
                name: "fk_parcela_lancamento_fatura_cartao_credito_id_fatura_cartao_c",
                table: "parcela_lancamento",
                column: "id_fatura_cartao_credito",
                principalTable: "fatura_cartao_credito",
                principalColumn: "id_fatura_cartao_credito");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_cartao_credito_carteira_id_carteira",
                table: "cartao_credito");

            migrationBuilder.DropForeignKey(
                name: "fk_parcela_lancamento_fatura_cartao_credito_id_fatura_cartao_c",
                table: "parcela_lancamento");

            migrationBuilder.DropIndex(
                name: "ix_parcela_lancamento_id_fatura_cartao_credito",
                table: "parcela_lancamento");

            migrationBuilder.DropIndex(
                name: "ix_cartao_credito_id_carteira",
                table: "cartao_credito");

            migrationBuilder.DropColumn(
                name: "refresh_token",
                table: "usuario");

            migrationBuilder.DropColumn(
                name: "refresh_token_expiration",
                table: "usuario");

            migrationBuilder.DropColumn(
                name: "id_fatura_cartao_credito",
                table: "parcela_lancamento");

            migrationBuilder.DropColumn(
                name: "id_carteira",
                table: "cartao_credito");

            migrationBuilder.AlterColumn<string>(
                name: "senha",
                table: "usuario",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);
        }
    }
}
