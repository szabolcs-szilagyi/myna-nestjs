\d session;

ALTER TABLE cart DROP CONSTRAINT IF EXISTS cart_session_fkey;

DROP TABLE IF EXISTS client;

DROP TABLE IF EXISTS session;

CREATE TABLE session (
  "id" varchar NOT NULL,
  "expiresAt" integer NOT NULL,
  "data" varchar NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expiresAt");

ALTER TABLE cart
  ADD COLUMN session VARCHAR DEFAULT NULL,
  ADD CONSTRAINT cart_session FOREIGN KEY (session) REFERENCES session(id) ON DELETE NO ACTION;
