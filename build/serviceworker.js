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

      //Inject timestamp
      let clone = responseFromNetwork.clone();
      var headers = new Headers(clone.headers);
			headers.append('sw-fetched-on', new Date().getTime());

      putInCache(request, new Response(clone.body,
        {
          status: clone.status,
          statusText: clone.statusText,
          headers: headers
        }));
      return responseFromNetwork;
    } catch (error) {
      console.error(error);
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
      let parsedDate = new Date(responseFromCache.headers.get("sw-fetched-on"));
      if (Math.abs(new Date() - parsedDate) > 3600000 && request.url.includes("schedule.php")) {
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