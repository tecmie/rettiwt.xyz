-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "handle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "has_custom_timelines" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Author" ("avatar", "bio", "handle", "has_custom_timelines", "id", "name", "url", "verified") SELECT "avatar", "bio", "handle", "has_custom_timelines", "id", "name", "url", "verified" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_handle_key" ON "Author"("handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
