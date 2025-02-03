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

export const files = createTable("files_table", {
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

export const folders = createTable("folders_table", {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    parent: int("parent"),
}, (t) => {
    return [
        index("parent_index").on(t.parent),
    ]
})
