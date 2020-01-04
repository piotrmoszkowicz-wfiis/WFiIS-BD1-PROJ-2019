CREATE or REPLACE FUNCTION after_item_deleted_trigger() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM game_owned_items WHERE item_id = NEW.id;
    DELETE FROM game_offers WHERE item_id = NEW.id;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_item_deleted on game_items;

CREATE TRIGGER trig_item_deleted AFTER DELETE ON game_items FOR EACH ROW
EXECUTE PROCEDURE after_item_deleted_trigger();
