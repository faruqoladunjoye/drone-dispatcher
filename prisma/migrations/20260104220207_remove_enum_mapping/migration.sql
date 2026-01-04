/*
  Warnings:

  - The values [lightweight,middleweight,cruiserweight,heavyweight] on the enum `DroneModel` will be removed. If these variants are still used in the database, this will fail.
  - The values [idle,loading,loaded,delivering,delivered,returning] on the enum `DroneState` will be removed. If these variants are still used in the database, this will fail.
  - The values [access,refresh,forgot_password] on the enum `TokenType` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,dispatcher] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DroneModel_new" AS ENUM ('LIGHTWEIGHT', 'MIDDLEWEIGHT', 'CRUISERWEIGHT', 'HEAVYWEIGHT');
ALTER TABLE "Drone" ALTER COLUMN "model" TYPE "DroneModel_new" USING ("model"::text::"DroneModel_new");
ALTER TYPE "DroneModel" RENAME TO "DroneModel_old";
ALTER TYPE "DroneModel_new" RENAME TO "DroneModel";
DROP TYPE "public"."DroneModel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DroneState_new" AS ENUM ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING');
ALTER TABLE "public"."Drone" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Drone" ALTER COLUMN "state" TYPE "DroneState_new" USING ("state"::text::"DroneState_new");
ALTER TYPE "DroneState" RENAME TO "DroneState_old";
ALTER TYPE "DroneState_new" RENAME TO "DroneState";
DROP TYPE "public"."DroneState_old";
ALTER TABLE "Drone" ALTER COLUMN "state" SET DEFAULT 'IDLE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TokenType_new" AS ENUM ('ACCESS', 'REFRESH', 'FORGOT_PASSWORD');
ALTER TABLE "public"."Token" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Token" ALTER COLUMN "type" TYPE "TokenType_new" USING ("type"::text::"TokenType_new");
ALTER TYPE "TokenType" RENAME TO "TokenType_old";
ALTER TYPE "TokenType_new" RENAME TO "TokenType";
DROP TYPE "public"."TokenType_old";
ALTER TABLE "Token" ALTER COLUMN "type" SET DEFAULT 'ACCESS';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('ADMIN', 'DISPATCHER');
ALTER TABLE "public"."User" ALTER COLUMN "userType" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "userType" TYPE "UserType_new" USING ("userType"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "public"."UserType_old";
ALTER TABLE "User" ALTER COLUMN "userType" SET DEFAULT 'DISPATCHER';
COMMIT;

-- AlterTable
ALTER TABLE "Drone" ALTER COLUMN "state" SET DEFAULT 'IDLE';

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "type" SET DEFAULT 'ACCESS';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userType" SET DEFAULT 'DISPATCHER';
