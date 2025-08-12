INSERT INTO usuario(email, login, senha) VALUES ('paulo.takeda@gmail.com', 'ptakeda', '123456');

INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (1, 'Caixa');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (2, 'Conta Corrente');
INSERT INTO tipo_carteira(id_tipo_carteira, nome) VALUES (3, 'Conta Poupança');

-- INSERT INTO carteira(nome, id_tipo_carteira, id_usuario) VALUES ('Caixa', (SELECT id_tipo_carteira FROM tipo_carteira WHERE nome = 'Caixa'), (SELECT MIN(id_usuario) FROM usuario));