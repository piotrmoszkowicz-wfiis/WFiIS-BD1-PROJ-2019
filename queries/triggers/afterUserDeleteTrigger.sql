CREATE or REPLACE FUNCTION after_user_deleted_trigger() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM game_soldiers WHERE user_id = NEW.id;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_user_deleted on game_users;

CREATE TRIGGER trig_user_deleted AFTER DELETE ON game_users FOR EACH ROW
EXECUTE PROCEDURE after_user_deleted_trigger();
