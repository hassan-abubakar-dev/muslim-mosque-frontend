const InlineLoader = ({ size = 16 }) => {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-emerald-700"
      style={{ width: size, height: size }}
    />
  );
};

export default InlineLoader;
