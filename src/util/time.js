 const formatDuration = (seconds) => {
  const totalSeconds = Math.floor(seconds || 0); // Added || 0 to handle null/undefined safely
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export default formatDuration;