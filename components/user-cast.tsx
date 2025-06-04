"use client";

import { useState } from "react";
import { useDeleteCast, useFetchUserCast } from "@/services/neynar";
import { useNeynarContext } from "@neynar/react";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Trash2,
} from "lucide-react";

type User = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
} | null;

const ITEMS_PER_PAGE = 10;

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  // Format relative time
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // For older posts, show the date
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
  });
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

  const { mutate: deleteCast, isPending } = useDeleteCast();

  const handleDelete = () => {
    if (selectedCasts.length === 0) return;
    deleteCast(selectedCasts[0], {
      onSuccess: (res) => {
        toast.success("Cast Deleted Successfully");
        console.log(res);
        setSelectedCasts([]);
      },
      onError: (res) => {
        toast.error(res.message);
        console.log(res);
      },
    });
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {user?.displayName || user?.username || "User"}'s Casts
        </h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
          {messages.length} {messages.length === 1 ? "cast" : "casts"}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {paginatedMessages.map((msg) => (
            <div
              key={msg.hash}
              className={`bg-white p-5 border rounded-2xl shadow-sm transition-all duration-200 ${
                selectedCasts.includes(msg.hash)
                  ? "border-gray-400 bg-gray-50 shadow-md"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-md border cursor-pointer transition-all ${
                    selectedCasts.includes(msg.hash)
                      ? "bg-gray-800 border-gray-800"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => toggleSelection(msg.hash)}
                >
                  {selectedCasts.includes(msg.hash) && (
                    <Check className="text-white w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <p className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed">
                      {msg.data.castAddBody.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <time className="text-sm">
                        {formatDateTime(msg.data.timestamp)}
                      </time>

                      {msg.data.castAddBody.parentCastId && (
                        <div className="flex items-center ml-3 text-sm text-gray-500">
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          <span>
                            Reply to FID {msg.data.castAddBody.parentCastId.fid}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSelection(msg.hash)}
                        className={`p-1.5 rounded-full transition-colors ${
                          selectedCasts.includes(msg.hash)
                            ? "bg-gray-200 text-gray-700"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 px-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No casts found
          </h3>
          <p className="text-gray-500 text-sm">
            This user hasn't posted any casts yet.
          </p>
        </div>
      )}

      {/* Floating Delete Bar */}
      {selectedCasts.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 backdrop-blur-sm bg-white/90">
          <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-800">
                  {selectedCasts.length}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {selectedCasts.length === 1 ? "cast" : "casts"} selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCasts([])}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-70"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete{" "}
                {selectedCasts.length > 1 ? `(${selectedCasts.length})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserCast;
