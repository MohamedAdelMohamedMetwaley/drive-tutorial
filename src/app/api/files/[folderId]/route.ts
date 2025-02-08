import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { QUERIES } from "~/server/db/queries";

export async function GET(request: Request, { params }: { params: Promise<{ folderId: string }> }) {
    try {
        const urlParams = await params;
        const folderId = parseInt(urlParams.folderId);

        if (isNaN(folderId)) {
            return NextResponse.json(
                { error: 'Invalid folderId' },
                { status: 400 }
            );
        }

        const [files, folders, parents] = await Promise.all([
            QUERIES.getFiles(folderId),
            QUERIES.getFolders(folderId),
            QUERIES.getAllParentsForFolder(folderId),
        ]);

        return NextResponse.json({
            files,
            folders,
            parents
        });
    } catch (error) {
        console.error("Error fetching...", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
