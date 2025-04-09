import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../../skeleton/social-media-view/right-panel-skeleton";
import LoadingSpinner from "../common/loading-spinner";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:5300/api/social-media/user/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { data: followingUsers, isLoading: isFollowingLoading } = useQuery({
    queryKey: ["followingUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:5300/api/social-media/user/following");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

  return (
    <div className='hidden lg:block my-4 mx-2'>
      {/* Following Section */}
      <div className='bg-white p-4 rounded-md sticky top-2 flex flex-col gap-4 border-2 border-orange-500 mb-4 h-96 overflow-auto'>
        <p className='font-bold'>Following</p>
        <div className='flex-grow flex-col gap-4'>
          {isFollowingLoading && (
            <>
              <RightPanelSkeleton className="flex-grow" />
              <RightPanelSkeleton className="flex-grow" />
            </>
          )}
          {!isFollowingLoading &&
            followingUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className='flex items-center justify-between gap-4'
                key={user._id}
              >
                <div className='flex gap-2 items-center'>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold tracking-tight truncate w-28'>
                      {user.fullName}
                    </span>
                    <span className='text-sm text-slate-500'>@{user.username}</span>
                  </div>
                </div>
                <div>
                  <button
                    className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full border-2 border-orange-500 btn-sm'
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size='sm' /> : "Unfollow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Suggested Users Section */}
      <div className='bg-white p-4 rounded-md sticky top-2 flex flex-col gap-4 border-2 border-orange-500 h-96 overflow-auto'>
        <p className='font-bold'>Suggestions</p>
        <div className='flex-grow flex-col gap-4'>
          {isLoading && (
            <>
              <RightPanelSkeleton className="flex-grow" />
              <RightPanelSkeleton className="flex-grow" />
              <RightPanelSkeleton className="flex-grow" />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className='flex items-center justify-between gap-4'
                key={user._id}
              >
                <div className='flex gap-2 items-center'>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold tracking-tight truncate w-28'>
                      {user.fullName}
                    </span>
                    <span className='text-sm text-slate-500'>@{user.username}</span>
                  </div>
                </div>
                <div>
                  <button
                    className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full border-2 border-orange-500 btn-sm'
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size='sm' /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
