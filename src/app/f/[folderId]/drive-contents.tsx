"use client";

import { ChevronRight } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import FoldersContainer from "./FoldersContainer";

export default function DriveContents(props: {
    files: (typeof files_table.$inferSelect)[];
    folders: (typeof folders_table.$inferSelect)[];
    parents: (typeof folders_table.$inferSelect)[];
    currentFolderId: number;
}) {
    const navigate = useRouter();
    const posthog = usePostHog();

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Link
                        href={`/f/${props.parents[0]?.id}`}
                        className="mr-2 text-gray-300 hover:text-white"
                    >
                        My Drive
                    </Link>
                    {props.parents.slice(1).map((folder) =>
                        <div key={folder.id} className="flex items-center">
                            <ChevronRight className="mx-2 text-gray-500" size={16} />
                            <Link
                                href={`/f/${folder.id}`}
                                className="text-gray-300 hover:text-white"
                            >
                                {folder.name}
                            </Link>
                        </div>
                    )}
                </div>
                <div>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
            <FoldersContainer>
                <ul>
                    {props.folders.map((folder) => (
                        <FolderRow key={folder.id} folder={folder} />
                    ))}
                    {props.files.map((file) => (
                        <FileRow key={file.id} file={file} />
                    ))}
                </ul>
            </FoldersContainer>
            <UploadButton
                endpoint="driveUploader"
                onClientUploadComplete={() => {
                    navigate.refresh();
                }}
                onBeforeUploadBegin={(files) => {
                    posthog.capture("file_upload_started", {
                        file_count: files.length,
                    });
                    return files;
                }}
                input={{
                    folderId: props.currentFolderId,
                }}
                onUploadError={(error: Error) => {
                    alert(`Error! ${error.message}`);
                }}
                className="mt-6"
            />
        </>
    );
}
