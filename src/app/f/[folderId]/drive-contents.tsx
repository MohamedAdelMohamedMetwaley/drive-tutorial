"use client";

import { ChevronRight } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { usePostHog } from "posthog-js/react";
import useCache from "./useCache";

export default function DriveContents(props: {
    currentFolderId: number;
}) {
    const posthog = usePostHog();

    const currentFolderId = props.currentFolderId;

    const { files, folders, parents, isLoading, error, revalidate, isLoadingFile } = useCache(currentFolderId);

    if (error) {
        return <div>Failed to load folder contents</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={isLoading ? "#" : `/f/${parents?.at(0)?.id}`}
                            className="mr-2 text-gray-300 hover:text-white"
                        >
                            My Drive
                        </Link>
                        {!isLoading && parents?.slice(1).map((folder) =>
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
                <div className="rounded-lg bg-gray-800 shadow-xl">
                    <div className="border-b border-gray-700 px-6 py-4">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                            <div className="col-span-6">Name</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-3">Size</div>
                            <div className="col-span-1"></div>
                        </div>
                    </div>
                    {isLoading ?
                        <div className="flex items-center justify-center h-10">
                            <p>Loading files...</p>
                        </div> :
                        <ul>
                            <FolderRow folders={folders ?? []} parentId={currentFolderId} />
                            <FileRow files={files ?? []} parentId={currentFolderId} />
                        </ul>
                    }
                </div>
                <UploadButton
                    endpoint="driveUploader"
                    onClientUploadComplete={() => {
                        revalidate();
                    }}
                    onBeforeUploadBegin={(files) => {
                        posthog.capture("file_upload_started", {
                            file_count: files.length,
                        });
                        return files;
                    }}
                    input={{
                        folderId: currentFolderId,
                    }}
                    onUploadError={(error: Error) => {
                        alert(`Error! ${error.message}`);
                    }}
                    className="mt-6"
                />
            </div>
        </div>
    );
}
