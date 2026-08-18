

DROP TABLE IF EXISTS basics.app_events;

CREATE TABLE basics.app_events (

    -- UUID - 
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_name TEXT NOT NULL,

    -- JSONB
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO basics.app_events (event_name, metadata)
VALUES
(
    'sign_up',
    '{"browser": "chrome"}'
),
(
    'sign_in',
    '{"user": "sangam"}'
);

-- SELECT * FROM basics.app_events;

SELECT 
   event_name,
   metadata ->> 'browser' AS browser
FROM basics.app_events
WHERE metadata ? 'browser';