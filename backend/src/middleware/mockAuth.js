// Simple dev-only auth middleware.
// It injects req.user = { _id, timezone, dayStartHour } so endpoints can use userId/timezone.
export default function mockAuth(req, res, next) {
  // Change these values if you want a different "user"
  req.user = {
    _id: "000000000000000000000001",
    name: "Dev User",
    timezone: "Asia/Kolkata", // IANA tz
    dayStartHour: 4           // day starts at 4:00 local
  };
  next();
}
