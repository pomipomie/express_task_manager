import compression from "compression";

// Custom middleware to compress HTTP responses using the compression package.
const CompressionMiddleware = compression({
	level: 6,
	threshold: 1024, // Only compress responses larger than 1 KB
});

export default CompressionMiddleware;
