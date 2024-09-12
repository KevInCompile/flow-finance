CREATE OR REPLACE FUNCTION descontar_totaldue()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica si el día actual es el mismo que el día de pago (Payday)
    IF EXTRACT(DAY FROM CURRENT_DATE) = NEW.Payday THEN
        -- Descuenta el valor de FeeValue de TotalDue
        NEW.TotalDue := NEW.TotalDue - NEW.FeeValue;
        
        -- Resta 1 a Fee
        NEW.Fee := NEW.Fee - 1;

        -- Asegúrate de que TotalDue y Fee no sean valores negativos
        IF NEW.TotalDue < 0 THEN
            NEW.TotalDue := 0;
        END IF;

        IF NEW.Fee < 0 THEN
            NEW.Fee := 0;
        END IF;
    END IF;

    -- Retorna el registro modificado
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

