import Link from "next/link";
import FoldersContainer from "./FoldersContainer";

export default function PagePlaceholder() {
    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Link
                        href={"#"}
                        className="mr-2 text-gray-300 hover:text-white"
                    >
                        My Drive
                    </Link>
                </div>
                <div className="p-4 rounded-full bg-gray-800">
                </div>
            </div>
            <FoldersContainer>
                <div className="flex items-center justify-center h-10">
                    <p>Loading folders...</p>
                </div>
            </FoldersContainer>
        </>
    )
}
