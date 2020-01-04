CREATE or REPLACE FUNCTION after_soldier_deleted_trigger() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM game_owned_items WHERE owner_id = NEW.id;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_soldier_deleted on game_soldiers;

CREATE TRIGGER trig_soldier_deleted AFTER DELETE ON game_soldiers
    FOR EACH ROW
EXECUTE PROCEDURE after_soldier_deleted_trigger();
