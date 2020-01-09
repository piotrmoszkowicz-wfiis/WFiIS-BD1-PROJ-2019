CREATE or REPLACE FUNCTION after_item_deleted_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL THEN
        UPDATE game_owned_items SET deleted_at = NOW() WHERE item_id = NEW.id;
        UPDATE game_offers SET deleted_at = NOW() WHERE item_id = NEW.id;
    END IF;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_item_deleted on game_items;

CREATE TRIGGER trig_item_deleted AFTER UPDATE ON game_items FOR EACH ROW
EXECUTE PROCEDURE after_item_deleted_trigger();
