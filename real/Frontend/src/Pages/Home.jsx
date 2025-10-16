import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import VideoItem from "../Components/VideoItem";
import { useNavigate } from "react-router-dom";


/**
 * Home feed
 * - snap-y full screen feed
 * - pagination with sentinel
 * - prefetchNext function passed to VideoItem for next-video prebuffer
 */

const LIMIT = 5;

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate()

  const fetchFeed = useCallback(
    async (p = 1) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoadingPage(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/feed?page=${p}&limit=${LIMIT}`, {
          withCredentials: true,
          timeout: 120000,
        });
        const items = res?.data?.data || [];
        if (p === 1) setVideos(items);
        else setVideos((prev) => [...prev, ...items]);

        if (items.length < LIMIT) setHasMore(false);
      } catch (err) {
        if(err.response.data.message === "Please Login first"){
              navigate("/user/login")
        }
        
        console.error("Feed fetch error:", err);
      } finally {
        setLoadingPage(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  useEffect(() => {
    if (page === 1) return;
    fetchFeed(page);
  }, [page, fetchFeed]);

  // sentinel to load next page when visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingPage) {
          setPage((s) => s + 1);
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [hasMore, loadingPage]);

  // prefetch function: create offscreen video to start buffering next video
  const prefetchNext = useCallback((nextUrl) => {
    if (!nextUrl) return;
    try {
      const off = document.createElement("video");
      off.preload = "auto";
      off.muted = true;
      off.playsInline = true;
      off.src = nextUrl;

      // remove source after a while to release memory
      off.addEventListener(
        "canplay",
        () => {
          setTimeout(() => {
            try {
              off.src = "";
            } catch (e) {}
          }, 25_000); // keep buffered for 25s
        },
        { once: true }
      );
    } catch (e) {
      console.warn("prefetch failed", e);
    }
  }, []);

  // wrapper to provide next video url for prefetch
  const makePreload = (index) => () => {
    const next = videos[index + 1];
    if (next && (next.videoUrl || next.video)) prefetchNext(next.videoUrl || next.video);
  };

  return (
    <div className="w-screen h-screen bg-black text-white">
      <div
        className="h-screen w-full snap-y snap-mandatory overflow-y-scroll touch-pan-y scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {videos.length === 0 && !loadingPage && (
          <div className="h-screen flex items-center justify-center">
            <p className="text-gray-400">No videos yet. Check back later.</p>
          </div>
        )}

        {videos.map((v, idx) => (
          <div key={v._id || v.id} data-index={idx} className="h-screen snap-start">
            <VideoItem video={v} preloadNext={makePreload(idx)} />
          </div>
        ))}

        <div ref={sentinelRef} className="h-28 flex items-center justify-center">
          {loadingPage ? (
            <div className="text-gray-300">Loading more...</div>
          ) : hasMore ? (
            <div className="text-gray-400">Pull up to load more</div>
          ) : (
            <div className="text-gray-500">End of feed</div>
          )}
        </div>
      </div>

      {/* top bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between px-2">
        <div className="bg-white/10 px-3 py-1 rounded-full text-white font-bold">FoodShorts</div>
        
      </div>
    </div>
  );
};

export default Home;
