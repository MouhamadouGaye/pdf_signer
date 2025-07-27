BEGIN TRANSACTION;
-- 1. First verify current data
SELECT id,
    status
FROM documents
LIMIT 10;
-- 2. Add new column with proper constraints
ALTER TABLE documents
ADD COLUMN new_status VARCHAR(20) CONSTRAINT valid_status CHECK (
        new_status IN (
            'UPLOADED',
            'PROCESSING',
            'READY',
            'SIGNED',
            'ERROR'
        )
    );
-- 3. Convert data (with transaction-safe batch updates if large table)
UPDATE documents
SET new_status = CASE
        status
        WHEN 0 THEN 'UPLOADED'
        WHEN 1 THEN 'PROCESSING'
        WHEN 2 THEN 'READY'
        WHEN 3 THEN 'SIGNED'
        WHEN 4 THEN 'ERROR'
        ELSE 'ERROR' -- Handle unexpected values gracefully
    END;
-- 4. Verify conversion before dropping old column
SELECT status,
    new_status
FROM documents
LIMIT 100;
-- 5. Drop old column and rename (in same transaction)
ALTER TABLE documents DROP COLUMN status;
ALTER TABLE documents
    RENAME COLUMN new_status TO status;
COMMIT;
-- Consider creating a Flyway/Liquibase migration file for this change (better for production)
-- If you want even stricter DB-level validation:
sql
ALTER TABLE documents
ADD CONSTRAINT valid_status CHECK (
        status IN (
            'UPLOADED',
            'PROCESSING',
            'READY',
            'SIGNED',
            'ERROR'
        )
    );
-- @Enumerated(EnumType.STRING)  // ← This is the key annotation
-- @Column(length = 20)          // Optional but recommended for database schema
-- private Status status;
-- Then use this simple migration:
sql -- Single-step conversion (PostgreSQL specific)
ALTER TABLE documents
ALTER COLUMN status TYPE VARCHAR(20) USING (
        CASE
            status
            WHEN 0 THEN 'UPLOADED'
            WHEN 1 THEN 'PROCESSING'
            WHEN 2 THEN 'READY'
            WHEN 3 THEN 'SIGNED'
            WHEN 4 THEN 'ERROR'
            ELSE 'ERROR'
        END
    );
-- Create new simplified role storage
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Create the user_roles join table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Assign ADMIN to user with id=1
INSERT INTO user_roles (user_id, role)
VALUES (1, 'ADMIN') ON CONFLICT (user_id, role) DO NOTHING;
-- Assign MANAGER to user with id=2
INSERT INTO user_roles (user_id, role)
VALUES (2, 'MANAGER') ON CONFLICT (user_id, role) DO NOTHING;
-- Assign MANAGER to user with id=3
INSERT INTO user_roles (user_id, role)
VALUES (3, 'MANAGER') ON CONFLICT (user_id, role) DO NOTHING;
-- First clear any existing roles for these users (optional)
DELETE FROM user_roles
WHERE user_id IN (1, 2, 3);
-- Then add the new roles
INSERT INTO user_roles (user_id, role)
VALUES (1, 'ADMIN'),
    (2, 'MANAGER'),
    (3, 'MANAGER');