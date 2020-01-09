CREATE or REPLACE FUNCTION after_user_deleted_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL THEN
        UPDATE game_soldiers SET deleted_at = NOW() WHERE user_id = NEW.id;
    END IF;
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_user_deleted on game_users;

CREATE TRIGGER trig_user_deleted AFTER UPDATE ON game_users FOR EACH ROW
EXECUTE PROCEDURE after_user_deleted_trigger();
