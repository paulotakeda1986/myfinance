CREATE OR REPLACE FUNCTION recalcular_limite_cartao()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_tipo_lancamento_financeiro = 2 THEN
        UPDATE cartao_credito cc
        SET limite_atual = limite_atual - NEW.valor_lancamento_financeiro
        FROM fatura_cartao_credito f
        WHERE f.id_fatura_cartao_credito = NEW.id_fatura_cartao_credito
          AND f.id_cartao_credito = cc.id_cartao_credito;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalcular_limite_cartao
AFTER INSERT ON lancamento_financeiro
FOR EACH ROW
EXECUTE FUNCTION recalcular_limite_cartao();