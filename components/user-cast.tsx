import React, { useState } from "react";
import { useDeleteCast, useFetchUserCast } from "@/services/neynar";
import { useNeynarContext } from "@neynar/react";
import { toast } from "sonner";

type User = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
} | null;

const ITEMS_PER_PAGE = 10;

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const UserCast = ({ user }: { user: User }) => {
  const { data, isLoading } = useFetchUserCast(user?.fid ?? 0);
  const { user: userData } = useNeynarContext();
  const [selectedCasts, setSelectedCasts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const messages =
    data?.messages?.filter((msg) => msg?.data?.castAddBody) ?? [];

  const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
  const paginatedMessages = messages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelection = (hash: string) => {
    setSelectedCasts((prev) =>
      prev.includes(hash) ? prev.filter((h) => h !== hash) : [...prev, hash]
    );
  };
  const {mutate: deleteCast} = useDeleteCast()

  const handleDelete = () =>{
    if (selectedCasts.length === 0) return;
   deleteCast(selectedCasts[0], {
    onSuccess: (res) =>{
        toast.success('Cast Deleted Success')
        console.log(res)
        setSelectedCasts([])
    },
    onError: (res) =>{
toast.error(res.message)
console.log(res)
    }
   })
  }
  return (
    <section className="w-full max-w-2xl mx-auto mt-8 pb-20">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {user?.displayName || user?.username || "User"}'s Casts
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {paginatedMessages.map((msg) => (
            <div
              key={msg.hash}
              className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex items-start gap-2"
            >
              <input
                type="checkbox"
                checked={selectedCasts.includes(msg.hash)}
                onChange={() => toggleSelection(msg.hash)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {msg.data.castAddBody.text}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Posted on: {formatDateTime(msg.data.timestamp)}
                </p>
                {msg.data.castAddBody.parentCastId && (
                  <p className="mt-1 text-sm text-gray-400">
                    Replying to cast by FID{" "}
                    {msg.data.castAddBody.parentCastId.fid}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No casts found.</div>
      )}

      {/* Floating Delete Bar */}
      {selectedCasts.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
          <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-700">
              {selectedCasts.length} cast
              {selectedCasts.length > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => {
                // Placeholder for actual deletion logic
                alert(`Deleting ${selectedCasts.length} casts`);
                // setSelectedCasts([]);
                handleDelete()
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserCast;
