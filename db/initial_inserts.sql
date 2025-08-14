INSERT INTO usuario(email, login, senha) VALUES ('paulo.takeda@gmail.com', 'ptakeda', '123456');

INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (1, 'Caixa');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (2, 'Conta Corrente');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (3, 'Conta Poupança');

INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (NULL, 'Caixa', 1, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (57, 'Banco do Brasil - CC', 2, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (57, 'Banco do Brasil - CP', 3, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (141, 'Caixa Econômica - CC', 2, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (1400, 'NUBANK - CC', 2, 0, 1);

INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (1, 'Transferência entre contas pessoais');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (2, 'Transferência recebida de terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (3, 'Transferência realizada para terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (4, 'Pix realizado para terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (5, 'Pix recebido de terceiros');

INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (1, 'Movimento em carteira');
INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (2, 'Movimento em cartão de crédito');
INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (3, 'Movimento de transferência');