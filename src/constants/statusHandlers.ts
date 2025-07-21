export const StatusCodeActions: {
  [status: number]: (resJson: any) => {
    type: "modal" | "message";
    payload: any;
  };
} = {
  429: (json) => ({
    type: "modal",
    payload: {
      reason: json.tier === "basic" ? "EXCEEDED_BASIC" : "EXCEEDED_PLUS",
    },
  }),
  430: () => ({
    type: "message",
    payload:
      "Oh no, makanmana has run out of AI credits, please try again later.",
  }),
  431: () => ({
    type: "message",
    payload: "Your message is invalid or incomplete",
  }),
  401: () => ({
    type: "modal",
    payload: { reason: "NOT_SIGNED_IN" },
  }),
};
