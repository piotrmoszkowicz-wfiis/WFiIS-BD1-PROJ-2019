CREATE or REPLACE FUNCTION before_soldier_create_trigger() RETURNS TRIGGER AS $$
DECLARE
    idrecord RECORD;
BEGIN
    SELECT id INTO idrecord FROM game_soldiers WHERE user_id = NEW.user_id AND is_main = TRUE;
    IF idrecord.id IS NOT NULL THEN
        RAISE EXCEPTION 'This user already has main soldier';
    END IF;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_soldier_main_create on game_soldiers;

CREATE TRIGGER trig_soldier_main_create BEFORE INSERT ON game_soldiers FOR EACH ROW
EXECUTE PROCEDURE before_soldier_create_trigger();
