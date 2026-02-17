INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (1, 'Caixa');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (2, 'Conta Corrente');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (3, 'Conta Poupança');

INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (1, 'Transferência entre contas pessoais');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (2, 'Transferência recebida de terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (3, 'Transferência realizada para terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (4, 'Pix realizado para terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (5, 'Pix recebido de terceiros');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (6, 'Pix realizado para conta pessoal');
INSERT INTO tipo_transferencia_financeira(id_tipo_transferencia_financeira, nome) VALUES (7, 'Pix recebido de conta pessoal');

INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (1, 'Movimento em carteira');
INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (2, 'Movimento em cartão de crédito');
INSERT INTO tipo_lancamento_financeiro(id_tipo_lancamento_financeiro, nome) VALUES (3, 'Movimento de transferência');