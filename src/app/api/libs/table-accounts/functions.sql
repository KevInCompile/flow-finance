CREATE OR REPLACE FUNCTION insert_register_debt()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica si la fecha del evento es el día 1 de cualquier mes
    IF EXTRACT(DAY FROM NEW.fecha_evento) = 1 THEN
        -- Inserta un nuevo registro en la tabla registro_eventos
        INSERT INTO registro_eventos(evento_id, descripcion, fecha_registro)
        VALUES (NEW.id, NEW.descripcion, CURRENT_DATE);
    END IF;

    -- Retorna el registro NEW para proceder con la inserción original en la tabla eventos
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
