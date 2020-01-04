CREATE or REPLACE FUNCTION after_soldier_create_trigger() RETURNS TRIGGER AS $$
DECLARE
    itemrow RECORD;
BEGIN
    FOR itemrow IN
        SELECT id FROM game_items WHERE kit IN (-1, NEW.kit)
        LOOP
            INSERT INTO game_owned_items VALUES (DEFAULT, NEW.id, itemrow.id, NULL, NULL, NULL, NOW(), NOW(), NULL);
        END LOOP;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_soldier_create on game_soldiers;

CREATE TRIGGER trig_soldier_create AFTER INSERT ON game_soldiers FOR EACH ROW
EXECUTE PROCEDURE after_soldier_create_trigger();
