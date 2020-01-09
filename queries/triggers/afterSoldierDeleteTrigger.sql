CREATE or REPLACE FUNCTION after_soldier_deleted_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL THEN
        UPDATE game_owned_items SET deleted_at = NOW() WHERE owner_id = NEW.id;
        UPDATE game_soldiers_rounds_stats SET deleted_at = NOW() WHERE soldier_id = NEW.id;
    END IF;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_soldier_deleted on game_soldiers;

CREATE TRIGGER trig_soldier_deleted AFTER UPDATE ON game_soldiers
    FOR EACH ROW
EXECUTE PROCEDURE after_soldier_deleted_trigger();
