export const SignInUseCases = {
  NOT_SIGNED_IN: {
    title: "Sign in Required",
    message: "You need to sign in with Google to use the AI chatbot.",
  },
  EXCEEDED_BASIC: {
    title: "Limit Reached",
    message:
      "You've reached the free tier limit of 3 questions per hour. You can try again later or sign in to upgrade.",
  },
  EXCEEDED_PLUS: {
    title: "Limit Reached",
    message:
      "You've reached the Plus tier limit of 10 questions per hour. You can try again next hour, or upgrade to Ultra for unlimited access.",
  },
};
