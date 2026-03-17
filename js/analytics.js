window.dataLayer = window.dataLayer || [];
const host = window.location.hostname;

function gtag() {
  dataLayer.push(arguments);
}

if (host !== "localhost") {
  gtag("js", new Date());
  gtag("config", "G-4H0C61C0KZ");
}

function trackEvent(eventName, eventParams) {
  if (host !== "localhost") {
    gtag("event", eventName, eventParams);
  } else {
    console.log(`MOCK-EVENT: ${eventName}`, eventParams);
  }
}
