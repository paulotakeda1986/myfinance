INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (1, 'Caixa');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (2, 'Conta Corrente');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (3, 'Conta Poupança');

INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (NULL, 'Caixa', 1, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (57, 'Banco do Brasil - CC', 2, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (57, 'Banco do Brasil - CP', 3, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (141, 'Caixa Econômica - CC', 2, 0, 1);
INSERT INTO carteira(id_banco, nome, id_tipo_carteira, saldo_inicial, id_usuario) VALUES (1400, 'NUBANK - CC', 2, 0, 1);