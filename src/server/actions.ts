"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
    const session = await auth();
    if (!session.userId) {
        throw new Error("Not authenticated");
    }
    const [file] = await db
        .select()
        .from(files_table)
        .where(
            and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
        );
    if (!file) {
        return { error: "File not found" };
    }

    const utApiResult = await utApi.deleteFiles(
        file.url.replace("https://utfs.io/f/", ""),
    );

    console.log("utApiResult", utApiResult);

    const dbDeleteResult = await db
        .delete(files_table)
        .where(eq(files_table.id, fileId));

    console.log("dbDeleteResult", dbDeleteResult);

    return { success: true };
}

//TODO: make deleteFolder recursivly seach for children folders and delete them not just the immediate children
export async function deleteFolder(folderId: number) {
    const session = await auth();
    if (!session.userId) {
        throw new Error("Not authenticated");
    }


    const childrenFiles = await db
        .select()
        .from(files_table)
        .where(and(eq(files_table.parent, folderId), eq(files_table.ownerId, session.userId)));

    const fileUrls = childrenFiles.map(file => file.url.replace("https://utfs.io/f/", ""));

    const [utApiResult, dbDeleteChildrenFiles, dbDeleteChildrenFolders, dbDeleteFolder] = await Promise.all([
        utApi.deleteFiles(fileUrls),
        db.delete(files_table)
            .where(and(
                eq(files_table.parent, folderId),
                eq(files_table.ownerId, session.userId))),

        db.delete(folders_table)
            .where(and(
                eq(folders_table.parent, folderId),
                eq(folders_table.ownerId, session.userId))),

        db.delete(folders_table)
            .where(and(
                eq(folders_table.id, folderId),
                eq(folders_table.ownerId, session.userId)))
    ]);

    console.log("utApiResult", utApiResult);
    console.log("dbDeleteChildrenFiles", dbDeleteChildrenFiles);
    console.log("dbDeleteChildrenFolders", dbDeleteChildrenFolders);
    console.log("dbDeleteFolder", dbDeleteFolder);

    return { success: true };
}
