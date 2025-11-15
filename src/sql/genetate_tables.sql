CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash TEXT NOT NULL,
    gold BIGINT DEFAULT 0 NOT NULL,
    level INT DEFAULT 1 NOT NULL,
    experience BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE resource_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) NOT NULL UNIQUE,         -- wood, iron, gold, etc.
    
    base_time_ms INT NOT NULL,               -- базовое время добычи
    base_yield INT NOT NULL DEFAULT 1,        -- сколько получаем за добычу

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) NOT NULL UNIQUE,
    max_level INT NOT NULL DEFAULT 10, 

    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE tool_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tool_id UUID NOT NULL,
    level INT NOT NULL,
    
    speed_multiplier FLOAT NOT NULL DEFAULT 1.0,   -- уменьшает время добычи
    yield_multiplier FLOAT NOT NULL DEFAULT 1.0,   -- увеличивает количество
    
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,

    UNIQUE (tool_id, level)
);

CREATE TABLE user_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    tool_id UUID NOT NULL,                    -- ссылка на tools
    level INT NOT NULL DEFAULT 1,             -- текущий уровень инструмента
    efficiency_multiplier FLOAT DEFAULT 1.0,  -- влияет на скорость добычи
    unlocked BOOLEAN DEFAULT TRUE,            -- есть ли инструмент?

    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_tools_unique
    ON user_tools (user_id, tool_id);

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,             -- владелец

    item_type VARCHAR(50) NOT NULL,    -- RESOURCE | ITEM | TOOL | CONSUMABLE
    ref_id UUID NOT NULL,              -- ссылка на конкретный объект из другой таблицы

    quantity BIGINT NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_inventory_unique_item
    ON inventory (user_id, item_type, ref_id);

CREATE TABLE mining_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    resource_type_id UUID NOT NULL,

    start_time TIMESTAMP NOT NULL,
    finish_time TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_type_id) REFERENCES resource_types(id) ON DELETE CASCADE
);

CREATE TABLE buffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,
    speed_multiplier FLOAT DEFAULT 1.0,
    yield_multiplier FLOAT DEFAULT 1.0,
    duration_ms BIGINT,               -- сколько действует эффект

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_buffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    buff_id UUID NOT NULL,
    expires_at TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buff_id) REFERENCES buffs(id) ON DELETE CASCADE
);