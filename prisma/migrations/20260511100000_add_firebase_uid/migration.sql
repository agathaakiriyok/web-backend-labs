ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "firebaseUid" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "users_firebaseUid_key" ON "users"("firebaseUid");
