-- =========================================
-- Função única para atualizar limite do cartão e saldo da carteira
-- =========================================
CREATE OR REPLACE FUNCTION atualizar_saldo_e_limite()
RETURNS TRIGGER AS $$
DECLARE
    delta_cartao numeric(15,2);
    delta_carteira numeric(15,2);
BEGIN
    -- ===============================
    -- Inicializa deltas
    -- ===============================
    delta_cartao := 0;
    delta_carteira := 0;

    -- ===============================
    -- TRATAMENTO DO CARTÃO (tipo 2)
    -- ===============================
    IF TG_OP = 'INSERT' THEN
        IF NEW.id_tipo_lancamento_financeiro = 2 AND NEW.valor_lancamento_financeiro > 0 THEN
            delta_cartao := -NEW.valor_lancamento_financeiro;
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        -- Remove o efeito do valor antigo, se era tipo 2
        IF OLD.id_tipo_lancamento_financeiro = 2 AND OLD.valor_lancamento_financeiro > 0 THEN
            delta_cartao := delta_cartao + OLD.valor_lancamento_financeiro;
        END IF;
        -- Aplica o efeito do novo valor, se é tipo 2
        IF NEW.id_tipo_lancamento_financeiro = 2 AND NEW.valor_lancamento_financeiro > 0 THEN
            delta_cartao := delta_cartao - NEW.valor_lancamento_financeiro;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.id_tipo_lancamento_financeiro = 2 AND OLD.valor_lancamento_financeiro > 0 THEN
            delta_cartao := OLD.valor_lancamento_financeiro;
        END IF;
    END IF;

    -- Aplica atualização no limite do cartão se necessário
    IF delta_cartao <> 0 THEN
        UPDATE cartao_credito cc
        SET limite_atual = limite_atual + delta_cartao
        FROM fatura_cartao_credito f
        WHERE f.id_fatura_cartao_credito = COALESCE(NEW.id_fatura_cartao_credito, OLD.id_fatura_cartao_credito)
          AND f.id_cartao_credito = cc.id_cartao_credito;
    END IF;

    -- ===============================
    -- TRATAMENTO DA CARTEIRA (tipo 1 e efetivado)
    -- ===============================
    IF TG_OP = 'INSERT' THEN
        IF NEW.id_tipo_lancamento_financeiro = 1 AND NEW.fl_efetivada THEN
            delta_carteira := NEW.valor_lancamento_financeiro;
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        -- Remove efeito do antigo lançamento
        IF OLD.id_tipo_lancamento_financeiro = 1 AND OLD.fl_efetivada THEN
            delta_carteira := delta_carteira - OLD.valor_lancamento_financeiro;
        END IF;
        -- Aplica efeito do novo lançamento
        IF NEW.id_tipo_lancamento_financeiro = 1 AND NEW.fl_efetivada THEN
            delta_carteira := delta_carteira + NEW.valor_lancamento_financeiro;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.id_tipo_lancamento_financeiro = 1 AND OLD.fl_efetivada THEN
            delta_carteira := -OLD.valor_lancamento_financeiro;
        END IF;
    END IF;

    -- Aplica atualização do saldo da carteira se necessário
    IF delta_carteira <> 0 THEN
        UPDATE carteira
        SET saldo_atual = saldo_atual + delta_carteira
        WHERE id_carteira = COALESCE(NEW.id_carteira, OLD.id_carteira);
    END IF;

    -- ===============================
    -- Retorna o registro correto
    -- ===============================
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- Trigger única para lancamento_financeiro
-- =========================================
DROP TRIGGER IF EXISTS trg_atualizar_saldo_e_limite ON lancamento_financeiro;

CREATE TRIGGER trg_atualizar_saldo_e_limite
AFTER INSERT OR UPDATE OR DELETE ON lancamento_financeiro
FOR EACH ROW
EXECUTE FUNCTION atualizar_saldo_e_limite();