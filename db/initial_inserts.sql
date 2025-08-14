INSERT INTO usuario(email, login, senha) VALUES ('paulo.takeda@gmail.com', 'ptakeda', '123456');

INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (1, 'Caixa');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (2, 'Conta Corrente');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (3, 'Conta Poupança');

INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (NULL, 'Caixa', 1, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (57, 'Banco do Brasil - CC', 2, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (57, 'Banco do Brasil - CP', 3, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (141, 'Caixa Econômica - CC', 2, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (1400, 'NUBANK - CC', 2, 270.54, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (NULL, 'Flash (Vale Alimentação)', 1, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (NULL, 'SINTINORP (DUCZ)', 1, 8.93, 1);

INSERT INTO cartao_credito(id_cartao_credito, id_banco, nome, limite_total, id_usuario) VALUES (1, 57, 'Banco do Brasil', 28612, 1);
INSERT INTO cartao_credito(id_cartao_credito, id_banco, nome, limite_total, id_usuario) VALUES (2, 57, 'NUBANK', 10450, 1);
INSERT INTO cartao_credito(id_cartao_credito, id_banco, nome, limite_total, id_usuario) VALUES (3, 57, 'Caixa Econômica Federal', 22000, 1);

INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (1, 'Transferência entre contas pessoais');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (2, 'Transferência recebida de terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (3, 'Transferência realizada para terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (4, 'Pix realizado para terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (5, 'Pix recebido de terceiros');

INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (1, 'Movimento em carteira');
INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (2, 'Movimento em cartão de crédito');
INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (3, 'Movimento de transferência');

INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (1, 1, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (2, 2, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (3, 3, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (4, 4, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (5, 5, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (6, 6, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (7, 7, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (8, 8, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (9, 9, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (10, 10, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (11, 11, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (12, 12, 2025, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (13, 1, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (14, 2, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (15, 3, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (16, 4, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (17, 5, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (18, 6, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (19, 7, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (20, 8, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (21, 9, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (22, 10, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (23, 11, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (24, 12, 2026, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (25, 1, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (26, 2, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (27, 3, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (28, 4, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (29, 5, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (30, 6, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (31, 7, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (32, 8, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (33, 9, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (34, 10, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (35, 11, 2027, 1);
INSERT INTO competencia(id_competencia, mes, exercicio, id_usuario) VALUES (36, 12, 2027, 1);
