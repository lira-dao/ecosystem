CREATE SEQUENCE short_link_seq;

CREATE OR REPLACE FUNCTION to_base36(num BIGINT) RETURNS TEXT AS $$
DECLARE
    chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    base36 TEXT := '';
    remainder INT;
BEGIN
    IF num = 0 THEN
        RETURN '0';
    END IF;

    WHILE num > 0 LOOP
        remainder := (num % 36) + 1;
        base36 := substr(chars, remainder, 1) || base36;
        num := num / 36;
    END LOOP;

    RETURN base36;
END;
$$ LANGUAGE plpgsql;

-- 4. Funzione per generare il codice unico
CREATE OR REPLACE FUNCTION generate_sequential_short_code() RETURNS TEXT AS $$
DECLARE
    seq_value BIGINT;
    short_code TEXT;
BEGIN
    seq_value := nextval('short_link_seq');
    short_code := to_base36(seq_value);
    RETURN short_code;
END;
$$ LANGUAGE plpgsql;

-- 5. (Opzionale) Trigger per generare automaticamente lo short_code
CREATE OR REPLACE FUNCTION set_short_code() RETURNS TRIGGER AS $$
BEGIN
    NEW.code := generate_sequential_short_code();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER short_code_trigger
BEFORE INSERT ON short_links
FOR EACH ROW
EXECUTE FUNCTION set_short_code();
