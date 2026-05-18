import { useState, useMemo } from "react";
import question from "@/assets/dashboard/question.svg";
import GlobalLoader from "@/common/GlobalLoader";
import { useAllForumGetQuery } from "@/store/features/mentor-dashboard/forum/forum.api";
import { TForumGet } from "@/store/storeTypes/forum";
import { Link } from "react-router-dom";
import Pagination from "../reusable/Pagination";
import { timeAgo } from "@/common/timeAgo";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/features/auth/auth.slice";

interface ForumListProps {
  sortOrder: string;
  searchQuery: string;
}

const ForumList = ({ sortOrder, searchQuery }: ForumListProps) => {
  const { data, isLoading, isError } = useAllForumGetQuery(undefined);
  const rawPosts: TForumGet[] = useMemo(() => data?.data ?? [], [data]);

  const user = useSelector(selectUser);
  console.log(user);
  const role = user?.account?.role;
  console.log(role);

  // Filter and sort posts
  const posts = useMemo(() => {
    // First, filter by search query
    let filteredPosts = rawPosts;
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredPosts = rawPosts.filter((post) => {
        const titleMatch = post?.title?.toLowerCase().includes(lowerQuery);
        const contentMatch = post?.content?.toLowerCase().includes(lowerQuery);
        const tagsMatch = post?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        const categoryMatch = post?.category?.toLowerCase().includes(lowerQuery);
        
        return titleMatch || contentMatch || tagsMatch || categoryMatch;
      });
    }

    // Then, sort the filtered results
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      if (sortOrder === "newest") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });
    
    return sortedPosts;
  }, [rawPosts, sortOrder, searchQuery]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const productsPerPage = 5; // items per page

  const totalProducts = posts?.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Slice data for pagination
  const currentPosts = useMemo(() => {
    if (showAll) return posts;
    const startIndex = (currentPage - 1) * productsPerPage;
    return posts.slice(startIndex, startIndex + productsPerPage);
  }, [posts, currentPage, showAll]);

  const handleShowAll = () => setShowAll((prev) => !prev);

  // Reset to page 1 when sort order or search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [sortOrder, searchQuery]);

  // Loading state
  if (isLoading) return <GlobalLoader />;
  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-800"
      >
        We could not load forum discussions. Check your connection and try
        again.
      </div>
    );
  }
  if (totalProducts === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-slate-600">
        <p className="font-medium text-slate-800">
          {searchQuery.trim() ? "No matching discussions found" : "No forum posts yet"}
        </p>
        <p className="mt-2 text-sm">
          {searchQuery.trim() 
            ? "Try a different search term or clear the search to see all discussions."
            : 'Start a new discussion with the "New Discussion" button above.'}
        </p>
      </div>
    );
  }

  // Start & end range for display text
  const start = showAll ? 1 : (currentPage - 1) * productsPerPage + 1;
  const end = showAll
    ? totalProducts
    : Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="space-y-4">
      {/* Search results indicator */}
      {searchQuery.trim() && (
        <div className="text-sm text-gray-600 mb-4">
          Found {totalProducts} result{totalProducts !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}

      {currentPosts.map((post) => (
        <Link
          to={
            role === "MENTOR"
              ? `/mentor/forum-details/${post?._id}`
              : `/dashboard/forum-details/${post?._id}`
          }
          key={post?._id}
        >
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow mt-6 cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src={question}
                    alt="icon"
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {post?.title}
                </h3>
              </div>
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full w-fit">
                {post?.category}
              </span>
            </div>

            <p className="text-gray-600 mb-3 text-sm sm:text-base">
              {post?.content}
            </p>

            <div className="mt-4 sm:mt-6 space-y-2">
              <div className="flex gap-2 flex-wrap">
                {post?.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-black text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {post?.postedBy?.firstName} {post?.postedBy?.lastName} •{" "}
                {timeAgo(post?.createdAt)}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* ✅ Pagination */}
      <div className="mt-16 mb-32 flex justify-center space-x-5">
        {!showAll && totalPages > 1 && (
          <Pagination
            title="All Forums"
            showText={`Showing ${start} to ${end} of ${totalProducts} Forums`}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onToggleShowAll={handleShowAll}
            showAll={showAll}
          />
        )}

        {/* ✅ Show All Button (Optional) */}
        {showAll && (
          <div className="flex justify-center">
            <button
              onClick={handleShowAll}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumList;