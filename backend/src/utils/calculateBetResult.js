export const calculateBetResult = ({
  profitLoss,
  settledAt
}) => {
  if (!settledAt) {
    return "in_asteptare"
  }

  if (profitLoss > 0) {
    return "castigat"
  }

  if (profitLoss < 0) {
    return "pierdut"
  }

  return "anulat"
}