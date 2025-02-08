import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolder } from "~/server/actions";
import useCache from "./useCache";
import { files_table, folders_table } from "~/server/db/schema";
import { useEffect, useState } from "react";

function formatFileSize(size: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}


export function FileRow(props: { files: typeof files_table.$inferSelect[], parentId: number }) {
    const { files, parentId } = props;
    const { delFileFromCache, revalidate, isLoadingFile } = useCache(parentId);
    const [displayFiles, setDisplayFiles] = useState(files);

    useEffect(() => {
        setDisplayFiles(files);
    }, [files])

    function handleDeleteFile(fileId: number) {
        delFileFromCache(fileId);
        setDisplayFiles(prevFiles => prevFiles.filter(file => file.id != fileId));
        deleteFile(fileId).then(result => {
            if (result.error)
                throw new Error(result.error);
        }).catch((error: any) => {
            revalidate();
            alert(`There was an error deleting the file ${error}`);
        });
    }

    return <>
        {displayFiles?.map(file => (
            <li
                key={file.id}
                className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
            >
                <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-6 flex items-center">
                        <a
                            href={file.url}
                            className="flex items-center text-gray-100 hover:text-blue-400"
                            target="_blank"
                        >
                            <FileIcon className="mr-3" size={20} />
                            {file.name}
                        </a>
                    </div>
                    <div className="col-span-2 text-gray-400">{"file"}</div>
                    <div className="col-span-3 text-gray-400">
                        {formatFileSize(file.size)}
                    </div>
                    <div className="col-span-1 text-gray-400">
                        <Button
                            variant={"ghost"}
                            onClick={() => handleDeleteFile(file.id)}
                            aria-label="Delete file"
                        >
                            <Trash2Icon size={20} />
                        </Button>
                    </div>
                </div>
            </li>
        ))}
        {isLoadingFile &&
            <li
                className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
            >
                <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-6 flex items-center">
                        <a
                            href="#"
                            className="flex items-center text-gray-100 hover:text-blue-400"
                            target="_blank"
                        >
                            {"-"}
                        </a>
                    </div>
                    <div className="col-span-2 text-gray-400">{"-"}</div>
                    <div className="col-span-3 text-gray-400">
                        {"-"}
                    </div>
                    <div className="col-span-1 text-gray-400">
                    </div>
                </div>
            </li>
        }
    </>
}

export function FolderRow(props: {
    folders: typeof folders_table.$inferSelect[];
    parentId: number;
}) {
    const { folders, parentId } = props;
    const { delFolderFromCache } = useCache(parentId);
    const [displayFolders, setDisplayFolders] = useState(folders);

    useEffect(() => {
        setDisplayFolders(folders);
    }, [folders])

    function handleDelete(folderId: number) {
        delFolderFromCache(folderId);
        setDisplayFolders(prevFolders => prevFolders.filter(folder => folder.id != folderId));
        deleteFolder(folderId)
    }

    return displayFolders?.map(folder => (
        <li
            key={folder.id}
            className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
        >
            <div className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-6 flex items-center">
                    <Link
                        className="flex items-center text-gray-100 hover:text-blue-400"
                        href={`/f/${folder.id}`}
                    >
                        <FolderIcon className="mr-3" size={20} />
                        {folder.name}
                    </Link>
                </div>
                <div className="col-span-3 text-gray-400"></div>
                <div className="col-span-2 text-gray-400"></div>
                <div className="col-span-1 text-gray-400">
                    <Button
                        variant={"ghost"}
                        onClick={() => handleDelete(folder.id)}
                        aria-label="Delete folder"
                    >
                        <Trash2Icon size={20} />
                    </Button>
                </div>
            </div>
        </li>
    ))
}
