import { Suspense } from "react";
import DriveContentsLoader from "./DriveContentsLoader";
import PagePlaceholder from "./PagePlaceholder";

export default async function GoogleDriveClone(props: { params: Promise<{ folderId: string }> }) {
    const params = await props.params;
    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }

    return <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
        <div className="mx-auto max-w-6xl">
            <Suspense fallback={<PagePlaceholder />}>
                <DriveContentsLoader parsedFolderId={parsedFolderId} />
            </Suspense>
        </div>
    </div>
}
