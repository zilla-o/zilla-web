import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Search,
  Music,
  Clock,
  Heart,
  ListMusic,
} from "lucide-react";
import { tracks as allTracks, type Track } from "../data/tracks";

type RepeatMode = "off" | "all" | "one";

export function ZillaPlay() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"all" | "liked">("all");

  const audioRef = useRef<HTMLAudioElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);

  const displayTracks = view === "liked"
    ? allTracks.filter((t) => likedTracks.has(t.id))
    : allTracks;

  const filteredTracks = searchQuery
    ? displayTracks.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q)
        );
      })
    : displayTracks;

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentTrack && allTracks.length > 0) {
      playTrack(allTracks[0]);
      return;
    }
    setIsPlaying((p) => !p);
  }, [currentTrack, playTrack]);

  const playNext = useCallback(() => {
    if (!currentTrack) {
      if (allTracks.length > 0) playTrack(allTracks[0]);
      return;
    }

    const list = displayTracks.length > 0 ? displayTracks : allTracks;
    const idx = list.findIndex((t) => t.id === currentTrack.id);

    if (shuffle) {
      let randomIdx = Math.floor(Math.random() * list.length);
      if (list.length > 1 && randomIdx === idx) {
        randomIdx = (randomIdx + 1) % list.length;
      }
      playTrack(list[randomIdx]);
    } else {
      const nextIdx = idx + 1;
      if (nextIdx < list.length) {
        playTrack(list[nextIdx]);
      } else if (repeatMode === "all") {
        playTrack(list[0]);
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentTrack, shuffle, repeatMode, displayTracks, playTrack]);

  const playPrev = useCallback(() => {
    if (!currentTrack) return;
    const list = displayTracks.length > 0 ? displayTracks : allTracks;
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    if (progress > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    const prevIdx = idx - 1;
    if (prevIdx >= 0) {
      playTrack(list[prevIdx]);
    } else if (repeatMode === "all") {
      playTrack(list[list.length - 1]);
    }
  }, [currentTrack, progress, displayTracks, repeatMode, playTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  };

  const handleEnded = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    playNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = value;
    setProgress(value);
  };

  const toggleLike = (trackId: string) => {
    setLikedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const cycleRepeat = () => {
    setRepeatMode((prev) =>
      prev === "off" ? "all" : prev === "all" ? "one" : "off"
    );
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex flex-col h-full bg-ink-900">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Zilla Play</h1>
              <p className="text-xs text-slate-500 font-mono">{allTracks.length} tracks · stream instantly</p>
            </div>
          </div>

          {/* Now Playing hero (when a track is active) */}
          {currentTrack && (
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-8 p-6 rounded-2xl glass-card border border-ink-500/40 animate-fade-in">
              <div className="relative shrink-0">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.album}
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border border-ink-400/50 ${isPlaying ? "animate-glow-pulse" : ""}`}
                />
                {isPlaying && (
                  <div className="absolute -inset-2 rounded-2xl bg-lime-500/10 blur-xl -z-10" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <p className="text-xs font-mono text-lime-400 uppercase tracking-wider mb-1">Now Playing</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">{currentTrack.title}</h2>
                <p className="text-slate-400 mt-1">{currentTrack.artist} — {currentTrack.album}</p>
                {/* Mini visualizer */}
                {isPlaying && (
                  <div className="flex items-end gap-1 mt-4 h-8 justify-center sm:justify-start">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-lime-400/60 rounded-full"
                        style={{
                          height: `${20 + Math.abs(Math.sin((Date.now() / 300) + i)) * 80}%`,
                          animation: `float ${0.4 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-2">
              <button
                onClick={() => setView("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === "all"
                    ? "bg-lime-500/10 text-lime-400 border border-lime-500/20"
                    : "text-slate-500 border border-ink-500/40 hover:text-slate-300"
                }`}
              >
                <ListMusic className="w-4 h-4" />
                All Tracks
              </button>
              <button
                onClick={() => setView("liked")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === "liked"
                    ? "bg-lime-500/10 text-lime-400 border border-lime-500/20"
                    : "text-slate-500 border border-ink-500/40 hover:text-slate-300"
                }`}
              >
                <Heart className="w-4 h-4" />
                Liked
                {likedTracks.size > 0 && (
                  <span className="text-xs font-mono opacity-60">{likedTracks.size}</span>
                )}
              </button>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs, artists, albums..."
                className="w-full glass rounded-lg border border-ink-500/50 pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-lime-500/40 transition-all"
              />
            </div>
          </div>

          {/* Track list */}
          <div className="space-y-1">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Music className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No tracks found</p>
              </div>
            ) : (
              filteredTracks.map((track, i) => {
                const isActive = currentTrack?.id === track.id;
                const isLiked = likedTracks.has(track.id);
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "bg-lime-500/10 border border-lime-500/20"
                        : "hover:bg-ink-700/40 border border-transparent"
                    }`}
                  >
                    <div className="w-8 text-center shrink-0">
                      {isActive && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-4 justify-center">
                          <div className="w-0.5 bg-lime-400 rounded-full" style={{ height: "40%", animation: "float 0.3s ease-in-out infinite alternate" }} />
                          <div className="w-0.5 bg-lime-400 rounded-full" style={{ height: "80%", animation: "float 0.4s ease-in-out infinite alternate" }} />
                          <div className="w-0.5 bg-lime-400 rounded-full" style={{ height: "60%", animation: "float 0.5s ease-in-out infinite alternate" }} />
                        </div>
                      ) : (
                        <span className={`text-sm font-mono ${isActive ? "text-lime-400" : "text-slate-500 group-hover:hidden"}`}>
                          {i + 1}
                        </span>
                      )}
                      {!isActive && (
                        <Play className="w-4 h-4 text-lime-400 hidden group-hover:block mx-auto" />
                      )}
                    </div>

                    <img
                      src={track.cover}
                      alt={track.album}
                      className="w-11 h-11 rounded-lg object-cover border border-ink-400/40 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-lime-400" : "text-white"}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{track.artist}</p>
                    </div>

                    <span className="text-xs text-slate-600 hidden sm:block truncate max-w-[120px]">
                      {track.album}
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all shrink-0 ${
                        isLiked ? "text-lime-400" : "text-slate-600 hover:text-slate-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    </button>

                    <span className="text-xs font-mono text-slate-600 w-10 text-right shrink-0">
                      {isActive && duration > 0 ? formatTime(duration) : "--:--"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom player bar */}
      <div className="shrink-0 bg-ink-800 border-t border-ink-500/50 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-slate-500 w-10 text-right shrink-0">
              {formatTime(progress)}
            </span>
            <input
              ref={seekRef}
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-ink-500
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lime-400
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(132,204,22,0.5)]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-lime-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #84cc16 ${duration ? (progress / duration) * 100 : 0}%, #222738 ${duration ? (progress / duration) * 100 : 0}%)`,
              }}
            />
            <span className="text-xs font-mono text-slate-500 w-10 shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Track info (left) */}
            <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none sm:w-64">
              {currentTrack ? (
                <>
                  <img src={currentTrack.cover} alt={currentTrack.title} className="w-10 h-10 rounded-lg object-cover border border-ink-400/40 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{currentTrack.title}</p>
                    <p className="text-xs text-slate-500 truncate">{currentTrack.artist}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Music className="w-4 h-4" />
                  <span>No track selected</span>
                </div>
              )}
            </div>

            {/* Center controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShuffle((s) => !s)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  shuffle ? "text-lime-400" : "text-slate-500 hover:text-slate-300"
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={playPrev}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-ink-600 transition-all"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-lime-500 text-ink-900 hover:bg-lime-400 active:scale-95 transition-all glow-lime shrink-0"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={playNext}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-ink-600 transition-all"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={cycleRepeat}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  repeatMode !== "off" ? "text-lime-400" : "text-slate-500 hover:text-slate-300"
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Volume (right, hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-2 w-64 justify-end">
              <button
                onClick={() => setMuted((m) => !m)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 transition-all"
              >
                <VolumeIcon className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                className="w-20 h-1 rounded-full appearance-none cursor-pointer bg-ink-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-lime-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #84cc16 ${(muted ? 0 : volume) * 100}%, #222738 ${(muted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
