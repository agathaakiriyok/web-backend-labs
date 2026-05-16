-- AlterTable: remove password column (now managed by SuperTokens)
ALTER TABLE "users" DROP COLUMN IF EXISTS "password";
