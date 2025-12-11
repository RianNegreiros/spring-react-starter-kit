ALTER TABLE users 
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);

UPDATE users SET 
    first_name = SPLIT_PART(name, ' ', 1),
    last_name = SPLIT_PART(name, ' ', 2)
WHERE name IS NOT NULL;

ALTER TABLE users DROP COLUMN name;
