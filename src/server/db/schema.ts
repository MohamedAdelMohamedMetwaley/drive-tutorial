import "server-only"

import {
    int,
    text,
    index,
    singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator(
    (name) => `drive-tutorial_${name}`
);

export const files_table = createTable("files_table", {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    size: int("size").notNull(),
    parent: int("parent").notNull(),
    url: text("url").notNull(),
}, (t) => {
    return [
        index("parent_index").on(t.parent),
    ]
})

export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = createTable("folders_table", {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    parent: int("parent"),
}, (t) => {
    return [
        index("parent_index").on(t.parent),
    ]
})

export type DB_FolderType = typeof folders_table.$inferSelect;
