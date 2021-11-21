\d session;

ALTER TABLE cart DROP CONSTRAINT cart_session_fkey;
ALTER TABLE client DROP CONSTRAINT client_sid_fkey;

DROP TABLE session;

CREATE TABLE session (
  "id" varchar NOT NULL,
  "expiresAt" integer NOT NULL,
  "data" varchar NOT NULL
) WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expiresAt");

ALTER TABLE client ADD CONSTRAINT client_session FOREIGN KEY (sid) REFERENCES session(id) ON DELETE CASCADE;

ALTER TABLE cart ADD CONSTRAINT cart_session FOREIGN KEY (session) REFERENCES session(id) ON DELETE NO ACTION;
