import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";

export default async function DriveContentsLoader(props: {parsedFolderId: number}) {
    const parsedFolderId = props.parsedFolderId;
    const [files, folders, parents] = await Promise.all([
        QUERIES.getFiles(parsedFolderId),
        QUERIES.getFolders(parsedFolderId),
        QUERIES.getAllParentsForFolder(parsedFolderId),
    ]);
    return (
        <DriveContents files={files} folders={folders} parents={parents} currentFolderId={parsedFolderId} />
    )
}
