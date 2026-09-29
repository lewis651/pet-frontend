import React, { useEffect, useRef } from 'react';
export function MutedVideo({ src, className = '', poster, loop = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (!('IntersectionObserver' in window)) {
      video.play().catch(() => {});
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.2 });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, [src]);
  return <video ref={ref} src={src} poster={poster} className={className} muted loop={loop} playsInline preload="none" />;
}