CREATE or REPLACE FUNCTION after_user_create_trigger() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO game_soldiers VALUES (NULL, CONCAT(NEW.email, '_1'), NEW.id, '', 1, 0, 0, TRUE, NOW(), NOW(), NULL);
    INSERT INTO game_soldiers VALUES (NULL, CONCAT(NEW.email, '_2'), NEW.id, '', 1, 1, 0, FALSE, NOW(), NOW(), NULL);
    INSERT INTO game_soldiers VALUES (NULL, CONCAT(NEW.email, '_3'), NEW.id, '', 1, 2, 0, FALSE, NOW(), NOW(), NULL);
    INSERT INTO game_soldiers VALUES (NULL, CONCAT(NEW.email, '_4'), NEW.id, '', 1, 3, 0, FALSE, NOW(), NOW(), NULL);
    RETURN NEW;
END
$$LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trig_user_create on game_users;

CREATE TRIGGER trig_user_create AFTER INSERT ON game_users FOR EACH ROW
EXECUTE PROCEDURE after_user_create_trigger();
