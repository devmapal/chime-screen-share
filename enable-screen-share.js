function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = (event) => {
    try {
      const responseData = JSON.parse(
        decoder.decode(event.data, { stream: true })
      );

      const feature = responseData.Features.find(
        ({ Name }) => Name == "ExpressScreenShareWithoutExtension"
      );
      feature.Enabled = true;

      filter.write(encoder.encode(JSON.stringify(responseData)));
    } catch (error) {
      console.error("Failed to rewrite feature flag", error);
      filter.write(event.data);
    } finally {
      filter.disconnect();
    }
  };
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  { urls: ["https://*.chime.aws/ftr/features"] },
  ["blocking"]
);
