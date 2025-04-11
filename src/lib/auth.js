export function verifyAdmin(token) {
  const user = jwt.verify(token, SECRET);
  return user?.role === "admin" || user?.role === "superadmin";
}
