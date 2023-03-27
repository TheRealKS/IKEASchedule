const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
      addResourcesToCache([
        "/index.html",
        "/css/index.css"
      ])
    );
  });

  const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
  };

  const deleteFromCache = async (request) => {
    const cache = await caches.open("v1");
    await cache.delete(request);
  }
  
  const requestFromNetwork = async (request) => {
    try {
      const responseFromNetwork = await fetch(request);
      putInCache(request, responseFromNetwork.clone());
      return responseFromNetwork;
    } catch (error) {
      return new Response('Network error happened', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  const cacheFirst = async ({ request }) => {
    //Get the resource from cache
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      //If we are getting the schedule, check the age of the cached request
      let parsedDate = new Date(responseFromCache.headers.get("Date"));
      if (Math.abs(new Date() - parsedDate) > 3600000) {
        //Older than 1 hour
        let newResponse = await requestFromNetwork(request);
        if (newResponse.status != 408) {
          await deleteFromCache(request);
          return newResponse;
        }
      }
      return responseFromCache;
    }

    return requestFromNetwork(request);
  };
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      cacheFirst({
        request: event.request
      })
    );
  });