export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false

  const normalizedEmail = email.trim().toLowerCase()
  const emailRegex = /^\S+@\S+\.\S+$/

  return emailRegex.test(normalizedEmail)
}