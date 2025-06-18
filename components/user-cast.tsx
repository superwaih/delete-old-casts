
"use client";

import { useState, useEffect } from "react";
import { useFetchUserCast, useDeleteCast } from "@/services/neynar";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Trash2,
  ChevronDown,
} from "lucide-react";
import CustomDialog from "@/components/custom-dialog";

type User = {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  // Handle both naming conventions
  displayName?: string;
  pfpUrl?: string;
} | null;

interface UserCastProps {
  user: User;
  signerUuid?: string;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 10, 100, 1000];

const formatDateTime = (timestamp: number) => {
  let date = new Date(timestamp);
  if (date.getFullYear() < 1990) {
    date = new Date(timestamp * 1000);
  }

  if (date.getFullYear() < 1990) {
    // Try Farcaster epoch: January 1, 2021 00:00:00 UTC
    const farcasterEpoch = new Date("2021-01-01T00:00:00Z").getTime();
    date = new Date(farcasterEpoch + timestamp * 1000);
  }

  // Validate the date
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function UserCast({ user, signerUuid }: UserCastProps) {
  const { data, isLoading, refetch } = useFetchUserCast(user?.fid ?? 0);
  const [selectedCasts, setSelectedCasts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingCasts, setDeletingCasts] = useState<Record<string, boolean>>(
    {}
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [castsToDelete, setCastsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedCasts, setDeletedCasts] = useState<Set<string>>(new Set());

  const displayName = user?.display_name || user?.displayName;
  const username = user?.username;

  // Filter out deleted casts from the messages
  const messages =
    data?.messages?.filter(
      (msg) => msg?.data?.castAddBody && !deletedCasts.has(msg.hash)
    ) ?? [];

  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const paginatedMessages = messages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get hashes of current page messages (excluding deleted ones)
  const currentPageHashes = paginatedMessages
    .map((msg) => msg.hash)
    .filter((hash) => !deletedCasts.has(hash));

  // Check if all current page items are selected
  const isAllCurrentPageSelected =
    currentPageHashes.length > 0 &&
    currentPageHashes.every((hash) => selectedCasts.includes(hash));

  // Check if some current page items are selected
  const isSomeCurrentPageSelected = currentPageHashes.some((hash) =>
    selectedCasts.includes(hash)
  );

  // Clean up selected casts when casts are deleted
  useEffect(() => {
    if (deletedCasts.size > 0) {
      setSelectedCasts((prev) =>
        prev.filter((hash) => !deletedCasts.has(hash))
      );
    }
  }, [deletedCasts]);

  const toggleSelection = (hash: string) => {
    // Don't allow selection of deleted casts
    if (deletedCasts.has(hash) || deletingCasts[hash]) return;

    setSelectedCasts((prev) =>
      prev.includes(hash) ? prev.filter((h) => h !== hash) : [...prev, hash]
    );
  };

  const toggleSelectAllCurrentPage = () => {
    if (isAllCurrentPageSelected) {
      // Deselect all current page items
      setSelectedCasts((prev) =>
        prev.filter((hash) => !currentPageHashes.includes(hash))
      );
    } else {
      // Select all current page items (excluding deleted ones)
      setSelectedCasts((prev) => {
        const newSelection = [...prev];
        currentPageHashes.forEach((hash) => {
          if (!newSelection.includes(hash) && !deletedCasts.has(hash)) {
            newSelection.push(hash);
          }
        });
        return newSelection;
      });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const { mutate: deleteCast } = useDeleteCast();

  const confirmDelete = () => {
    // Filter out any deleted casts from selection
    const validCastsToDelete = selectedCasts.filter(
      (hash) => !deletedCasts.has(hash)
    );
    setCastsToDelete(validCastsToDelete);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (castsToDelete.length === 0) return;

    setIsDeleting(true);
    let successCount = 0;
    let failureCount = 0;

    // Mark all as deleting
    const newDeletingState: Record<string, boolean> = {};
    castsToDelete.forEach((hash) => {
      newDeletingState[hash] = true;
    });
    setDeletingCasts(newDeletingState);

    // Process deletions
    for (const hash of castsToDelete) {
      try {
        await new Promise<void>((resolve, reject) => {
          deleteCast(
            { hash, signer: signerUuid ?? "" },
            {
              onSuccess: () => {
                successCount++;
                // Immediately mark as deleted (optimistic update)
                setDeletedCasts((prev) => new Set([...prev, hash]));
                // Remove from selected casts
                setSelectedCasts((prev) => prev.filter((h) => h !== hash));
                // Remove from deleting state
                setDeletingCasts((prev) => ({ ...prev, [hash]: false }));
                resolve();
              },
              onError: (error) => {
                failureCount++;
                console.error(`Failed to delete cast ${hash}:`, error);
                // Remove from deleting state but keep in selected
                setDeletingCasts((prev) => ({ ...prev, [hash]: false }));
                reject(error);
              },
            }
          );
        });
      } catch (error) {
        // Error already handled in onError callback
      }
    }

    // Show final status
    if (successCount > 0) {
      toast.success(
        `Successfully deleted ${successCount} cast${
          successCount !== 1 ? "s" : ""
        }`
      );
      // Trigger refetch to sync with server
      setTimeout(() => {
        refetch();
      }, 500);
    }

    if (failureCount > 0) {
      toast.error(
        `Failed to delete ${failureCount} cast${failureCount !== 1 ? "s" : ""}`
      );
    }

    // Clear the castsToDelete array and reset states
    setCastsToDelete([]);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const hasSelectedCasts =
    selectedCasts.filter((hash) => !deletedCasts.has(hash)).length > 0;

  return (
    <section className="w-full max-w-2xl mx-auto px-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {displayName || username || "Your"} Casts
        </h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
          {messages.length} {messages.length === 1 ? "cast" : "casts"}
        </span>
      </div>

      {/* Controls Section */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-xl border border-gray-100">
        {/* Select All and Items Per Page */}
        <div className="flex items-center gap-4">
          {/* Select All Current Page */}
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded border cursor-pointer transition-all flex items-center justify-center ${
                isAllCurrentPageSelected
                  ? "bg-gray-800 border-gray-800"
                  : isSomeCurrentPageSelected
                  ? "bg-gray-400 border-gray-400"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={toggleSelectAllCurrentPage}
            >
              {isAllCurrentPageSelected && (
                <Check className="text-white w-3 h-3" />
              )}
              {isSomeCurrentPageSelected && !isAllCurrentPageSelected && (
                <div className="w-2 h-2 bg-white rounded-sm" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {isAllCurrentPageSelected ? "Deselect All" : "Select All"} (
              {currentPageHashes.length})
            </span>
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                disabled={hasSelectedCasts}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>

        {hasSelectedCasts && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-800">
                {selectedCasts.filter((hash) => !deletedCasts.has(hash)).length}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">selected</span>
          </div>
        )}
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
          {paginatedMessages.map((msg) => {
            const isDeleted = deletedCasts.has(msg.hash);
            const isCurrentlyDeleting = deletingCasts[msg.hash];

            // Don't render deleted casts
            if (isDeleted) return null;

            return (
              <div
                key={msg.hash}
                className={`bg-white p-5 border rounded-2xl shadow-sm transition-all duration-200 ${
                  selectedCasts.includes(msg.hash)
                    ? "border-gray-400 bg-gray-50 shadow-md"
                    : "border-gray-100 hover:border-gray-200"
                } ${
                  isCurrentlyDeleting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-md border cursor-pointer transition-all flex items-center justify-center ${
                      selectedCasts.includes(msg.hash)
                        ? "bg-gray-800 border-gray-800"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isCurrentlyDeleting ? "cursor-not-allowed" : ""}`}
                    onClick={() =>
                      !isCurrentlyDeleting && toggleSelection(msg.hash)
                    }
                  >
                    {selectedCasts.includes(msg.hash) && (
                      <Check className="text-white w-4 h-4" />
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
                              Reply to FID{" "}
                              {msg.data.castAddBody.parentCastId.fid}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrentlyDeleting ? (
                          <div className="p-1.5">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          </div>
                        ) : (
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                  disabled={currentPage === 1 || hasSelectedCasts}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Previous page"
                  title={
                    hasSelectedCasts
                      ? "Clear selections to navigate pages"
                      : "Previous page"
                  }
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
                        disabled={hasSelectedCasts}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                          currentPage === pageNum
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        title={
                          hasSelectedCasts
                            ? "Clear selections to navigate pages"
                            : `Go to page ${pageNum}`
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages || hasSelectedCasts}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Next page"
                  title={
                    hasSelectedCasts
                      ? "Clear selections to navigate pages"
                      : "Next page"
                  }
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, messages.length)} of{" "}
            {messages.length} casts
            {hasSelectedCasts && (
              <span className="ml-2 text-amber-600 font-medium">
                • Clear selections to change pages or items per page
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 px-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No casts found
          </h3>
          <p className="text-gray-500 text-sm">
            You haven't posted any casts yet.
          </p>
        </div>
      )}

      {/* Floating Delete Bar */}
      {hasSelectedCasts && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 backdrop-blur-sm bg-white/95">
          <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-800">
                  {
                    selectedCasts.filter((hash) => !deletedCasts.has(hash))
                      .length
                  }
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {selectedCasts.filter((hash) => !deletedCasts.has(hash))
                  .length === 1
                  ? "cast"
                  : "casts"}{" "}
                selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCasts([])}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting || !hasSelectedCasts}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete{" "}
                    {selectedCasts.filter((hash) => !deletedCasts.has(hash))
                      .length > 1
                      ? `(${
                          selectedCasts.filter(
                            (hash) => !deletedCasts.has(hash)
                          ).length
                        })`
                      : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <CustomDialog
        isOpen={showDeleteConfirm}
        onClose={() => !isDeleting && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Casts"
        description={`Are you sure you want to delete ${
          castsToDelete.length === 1
            ? "this cast"
            : `these ${castsToDelete.length} casts`
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </section>
  );
}
