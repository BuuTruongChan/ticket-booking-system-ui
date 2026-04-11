export type Messages = {
  COMMON: {
    genericTitle: string;
    genericMessage: string;
    retryLabel: string;
    backToHomeLabel: string;
    backToEventsLabel: string;
  };
  AUTH: {
    unauthorizedTitle: string;
    unauthorizedMessage: string;
    organizerUnauthorizedTitle: string;
    organizerUnauthorizedMessage: string;
    browseEventsLabel: string;
  };
  CATALOG: {
    listLoadTitle: string;
    listLoadMessage: string;
    clearFiltersLabel: string;
  };
  CATALOG_EVENT_DETAIL: {
    title: string;
    message: string;
    retryLabel: string;
    backToEventsLabel: string;
    routeThrowMessage: string;
  };
  ORGANIZER: {
    dashboardLoadMessage: string;
    eventDetailLoadMessage: string;
    eventNotFoundMessage: string;
    ticketSummaryLoadMessage: string;
    ticketListLoadMessage: string;
    ticketDetailLoadMessage: string;
    qrValidateErrorTitle: string;
    qrValidateErrorDescription: string;
    qrValidateInlineError: string;
  };
  WAIT_ROOM: {
    requestAccessError: string;
  };
  API: {
    contractErrorMessage: string;
    serverErrorMessage: string;
    unauthorizedMessage: string;
    conflictMessage: string;
    networkMessage: string;
  };
};

export const UI_MESSAGES: Messages = {
  COMMON: {
    genericTitle: "Something went wrong",
    genericMessage: "Please try again in a moment.",
    retryLabel: "Retry",
    backToHomeLabel: "Back to home",
    backToEventsLabel: "Back to events",
  },
  AUTH: {
    unauthorizedTitle: "Access denied",
    unauthorizedMessage: "You do not have permission to view this page.",
    organizerUnauthorizedTitle: "Organizer access required",
    organizerUnauthorizedMessage:
      "This page is available only to organizer accounts.",
    browseEventsLabel: "Browse events",
  },
  CATALOG: {
    listLoadTitle: "Unable to load events right now.",
    listLoadMessage:
      "You can retry the request without losing your current filters.",
    clearFiltersLabel: "Clear filters",
  },
  CATALOG_EVENT_DETAIL: {
    title: "Unable to load event detail",
    message:
      "We could not load this event right now. Please try again or return to the event list.",
    retryLabel: "Retry",
    backToEventsLabel: "Back to events",
    routeThrowMessage: "Unable to load this event right now. Please try again.",
  },
  ORGANIZER: {
    dashboardLoadMessage: "Unable to load organizer events right now.",
    eventDetailLoadMessage: "Unable to load event detail right now.",
    eventNotFoundMessage: "This event is not available.",
    ticketSummaryLoadMessage: "Unable to load ticket summary.",
    ticketListLoadMessage: "Unable to load organizer tickets.",
    ticketDetailLoadMessage: "Unable to load ticket detail.",
    qrValidateErrorTitle: "Unable to validate QR",
    qrValidateErrorDescription: "Please check the token and try again.",
    qrValidateInlineError:
      "Validation failed. Please retry with a valid token.",
  },
  WAIT_ROOM: {
    requestAccessError: "Unable to request queue access. Please retry.",
  },
  API: {
    contractErrorMessage: "Something went wrong. Please try again later.",
    serverErrorMessage: "Something went wrong. Please try again later.",
    unauthorizedMessage: "Your session has expired. Please sign in again.",
    conflictMessage:
      "This action could not be completed because the data changed.",
    networkMessage:
      "Network connection lost. Please check your connection and retry.",
  },
};
