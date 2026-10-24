import ratelimit from "../configurations/upstash.js";
const ratelimiter=async (req,res,next) => {
try {
const identifier = req.ip || req.connection.remoteAddress || 'unknown';
const {success, limit, reset, remaining} = await ratelimit.limit(identifier);
res.setHeader('X-RateLimit-Limit', limit);
res.setHeader('X-RateLimit-Remaining', remaining);
res.setHeader('X-RateLimit-Reset', reset);
if(!success){
    console.log(`Rate limit exceeded for ${identifier}`);
return res.status(429).json({
message:"Too many requests",
retryAfter: reset
});
}
console.log(`Request allowed for ${identifier}. Remaining: ${remaining}`);
next();
} catch (error) {
console.error("Rate limit error:", error);
next();
}
};
export default ratelimiter;