export const RATE_LIMITS = {
  basic: 3,
  plus: 10,
  pro: Infinity,
};

type Tier = keyof typeof RATE_LIMITS;

interface CheckAccessParams {
  token: string | null;
  tier: string;
  usageCount: number;
}

interface AccessResult {
  allowed: boolean;
  reason?: "NOT_SIGNED_IN" | "EXCEEDED_BASIC" | "EXCEEDED_PLUS";
}

export const checkAccess = ({
  token,
  tier,
  usageCount,
}: CheckAccessParams): AccessResult => {
  if (!token) {
    return { allowed: false, reason: "NOT_SIGNED_IN" };
  }

  const normalizedTier = (tier?.toLowerCase() ?? "basic") as Tier;
  const limit = RATE_LIMITS[normalizedTier] ?? 0;

  if (limit === Infinity) {
    return { allowed: true };
  }

  if (usageCount >= limit) {
    return {
      allowed: false,
      reason: normalizedTier === "basic" ? "EXCEEDED_BASIC" : "EXCEEDED_PLUS",
    };
  }

  return { allowed: true };
};
