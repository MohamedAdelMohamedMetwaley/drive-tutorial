"use client"

import { useCallback, useEffect, useState } from "react";
import type { files_table, folders_table } from "~/server/db/schema";

interface DriveContentsData {
    files: typeof files_table.$inferSelect[],
    folders: typeof folders_table.$inferSelect[],
    parents: typeof folders_table.$inferSelect[],
}

const cache = new Map<number, DriveContentsData>();

const useCache = (folderId: number) => {
    const [isLoading, setIsLoading] = useState(true);
    // TODO: create a skeleton for the file before uploading, then replaced it after upload success
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<DriveContentsData>();

    const revalidate = async () => {
        cache.delete(folderId);
        await fetchData();
    }
    const delFileFromCache = useCallback((fileId: number) => {
        setData(prevData => {
            if (!prevData) return prevData;

            const updatedFiles = prevData.files.filter(file => file.id != fileId);

            const updatedData: DriveContentsData = {
                ...prevData,
                files: updatedFiles,
            }

            cache.set(folderId, updatedData);
            return updatedData;
        });
    }, [folderId]);

    //TODO: make deleteFolder recursivly seach for children folders and delete them not just the immediate children
    const delFolderFromCache = useCallback((folderId: number) => {
        let children = [];
        setData(prevData => {
            if (!prevData) return prevData;

            const updatedFolder = prevData.folders.filter(folder => folder.id != folderId);

            //needs to be recursive
//            children = updatedFolder.map(folder => folder.parent === folderId);

            const updatedData: DriveContentsData = {
                ...prevData,
                folders: updatedFolder,
            }

            cache.set(folderId, updatedData);
            return updatedData;
        })
    }, [folderId]);

    const fetchData = useCallback(async () => {
        setIsLoadingFile(true);
        try {
            const res = await fetch(`/api/files/${folderId}`)

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const resData: DriveContentsData = await res.json();

            cache.set(folderId, resData);
            setData(resData);
            setError(null);
        } catch (e: any) {
            console.error("Error fetching data:", e);
            setError(e);
        } finally {
            setIsLoading(false);
            setIsLoadingFile(false);
        }
    }, [folderId]);

    useEffect(() => {
        if (cache.has(folderId)) {
            setData(cache.get(folderId));
            setIsLoading(false);
        } else {
            fetchData();
        }
    }, [folderId]);

    return { files: data?.files, folders: data?.folders, parents: data?.parents, isLoading, error, revalidate, delFileFromCache, delFolderFromCache, isLoadingFile }
}

export default useCache;
