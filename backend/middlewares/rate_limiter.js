const requestCounts = new Map();

export function rateLimiter(maxRequests = 30, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const record = requestCounts.get(key);
    if (!record || now - record.windowStart > windowMs) {
      requestCounts.set(key, { count: 1, windowStart: now });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({ error: 'Demasiadas solicitudes, intenta más tarde' });
    }

    record.count++;
    next();
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.windowStart > 60000) {
      requestCounts.delete(key);
    }
  }
}, 60000);