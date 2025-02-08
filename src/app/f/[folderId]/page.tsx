import DriveContents from "./drive-contents";

export default async function GoogleDriveClone(props: { params: Promise<{ folderId: string }> }) {
    const params = await props.params;
    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }

    return <DriveContents currentFolderId={parsedFolderId} />
}
