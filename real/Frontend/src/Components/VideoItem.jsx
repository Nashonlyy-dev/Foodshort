import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

/**
 * VideoItem
 * - Lazy-loads src when > 45% visible
 * - Autoplays when visible, pauses when not
 * - Prefetches next video via preloadNext() callback
 * - Double-tap to like (heart animation)
 * - Mute toggle, buffering spinner, small progress bar
 *
 * Props:
 * - video: { _id, name, description, price, videoUrl, partner:{name,logo} }
 * - preloadNext: function to prefetch next video's URL
 */
const VideoItem = ({ video, preloadNext }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [progress, setProgress] = useState(0);

  // IntersectionObserver to decide when to load/play
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // consider visible when 45% or more is in viewport
        if (e.intersectionRatio >= 0.45) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) } // fine granularity
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Attach src lazily and handle playback
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleCanPlay = () => {
      setIsReady(true);
      setIsBuffering(false);
      if (isVisible) {
        v.play().catch(() => {});
      }
    };
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleTime = () => {
      if (v.duration)
        setProgress(Math.round((v.currentTime / v.duration) * 100));
    };

    // attach listeners
    v.addEventListener("canplay", handleCanPlay);
    v.addEventListener("canplaythrough", handleCanPlay);
    v.addEventListener("waiting", handleWaiting);
    v.addEventListener("playing", handlePlaying);
    v.addEventListener("timeupdate", handleTime);

    // Lazy set src only when visible (avoid loading all)
    if (isVisible && (!v.src || v.src === window.location.href)) {
      // set src and load
      v.src = video.videoUrl;
      v.preload = "metadata";
      v.load();
      // ask parent to prefetch next item
      if (preloadNext) preloadNext();
    }

    // play/pause depending on visibility
    if (isVisible) {
      v.muted = muted;
      v.playsInline = true;
      v.play().catch(() => {});
    } else {
      try {
        v.pause();
      } catch (e) {}
    }

    return () => {
      v.removeEventListener("canplay", handleCanPlay);
      v.removeEventListener("canplaythrough", handleCanPlay);
      v.removeEventListener("waiting", handleWaiting);
      v.removeEventListener("playing", handlePlaying);
      v.removeEventListener("timeupdate", handleTime);
    };
  }, [isVisible, video.videoUrl, muted, preloadNext]);

  // Double-tap detection for like
  const lastTapRef = useRef(0);
  const handleTap = async () => {
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      // double tap detected
      setShowHeart(true);
      setLiked(true); // optimistic UI
      // small animation duration
      setTimeout(() => setShowHeart(false), 850);

      // optimistic API call
      try {
        await axios.post(
          `http://localhost:3000/api/food/${video._id}/like`,
          {},
          { withCredentials: true, timeout: 10000 }
        );
      } catch (err) {
        console.error("Like failed:", err);
        setLiked(false); // rollback on error
      }
    }
    lastTapRef.current = now;
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    // adjust actual element too
    if (videoRef.current) videoRef.current.muted = !muted;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full snap-start bg-black flex items-center justify-center"
      aria-live="polite"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted={muted}
        loop
        // src is attached lazily in effect
      />

      {/* spinner while buffering */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* clickable overlay for double-tap */}
      <button
        onClick={handleTap}
        aria-label="Video interaction"
        className="absolute inset-0 bg-transparent"
      />

      {/* heart animation */}
      {showHeart && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-white text-[72px] animate-pop opacity-95">
            ❤️
          </div>
        </div>
      )}

      {/* small top bar (partner) */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          {video.partner?.logo ? (
            <img
              className="w-9 h-9 rounded-full object-cover"
              src={video.partner.logo}
              alt={video.partner.name}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/20" />
          )}
          <div className="text-sm">
            <div className="font-semibold leading-none">
              {video.partner?.name || "Partner"}
            </div>
            <div className="text-xs text-white/70 leading-none">
              @
              {(video.partner?.name || "partner")
                .replace(/\s+/g, "")
                .toLowerCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="bg-black/40 text-white p-2 rounded-md shadow"
            aria-label={muted ? "Unmute video" : "Mute video"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* bottom panel with info and actions */}
      <div className="absolute left-4 right-4 bottom-6 z-30 text-white">
        <div className="flex items-start justify-between">
          <div className="max-w-[68%]">
            <h3 className="text-xl font-bold text-amber-50 mt-10 leading-tight">
              {video.name}
            </h3>
            <p className="text-lg text-white line-clamp-2 mt-1">
              {video.description}
            </p>
            <div className="mt-2 text-green-300 font-semibold">
              ${video.price}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={async () => {
                setLiked((s) => !s);
                try {
                  await axios.post(
                    `http://localhost:3000/api/food/${video._id}/like`,
                    {},
                    { withCredentials: true, timeout: 10000 }
                  );
                } catch (err) {
                  console.error("Like API failed", err);
                  setLiked((s) => !s);
                }
              }}
              className="bg-black/50 p-3 rounded-full shadow-md text-white text-xl"
              aria-pressed={liked}
            >
              {liked ? "❤️" : "🤍"}
            </button>

            <button className="bg-black/50 p-3 rounded-full shadow-md text-white text-xl">
              💾
            </button>
            <button className="bg-black/50 p-3 rounded-full shadow-md text-white text-xl">
              💬
            </button>
            <button
              onClick={async () => {
  try {
    // Ask user for quantity
    const qtyStr = prompt("Enter quantity to order:", "1");
    if (!qtyStr) return; // user cancelled

    const quantity = parseInt(qtyStr);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    // Ensure we have a valid productId
    const productId = video._id || video.id;
    if (!productId) {
      alert("Product ID missing. Cannot place order.");
      return;
    }

    // Call backend API to place order
    const response = await axios.post(
      "http://localhost:3000/api/order/place",
      { productId, quantity },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        timeout: 10000,
      }
    );

    console.log("Order response:", response.data);
    alert(`Order placed successfully! Quantity: ${quantity}`);
  } catch (err) {
    console.error("Order API failed", err);
    alert(err?.response?.data?.message || "Failed to place order");
  }
}}
className="bg-green-500 p-3 rounded-full shadow-md text-white text-xl"
>
              🛒
            </button>
          </div>
        </div>

        {/* small progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded overflow-hidden">
          <div
            className="h-full bg-white/70"
            style={{ width: `${progress}%`, transition: "width 200ms linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
