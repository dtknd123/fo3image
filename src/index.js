
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET") {
      return new Response("Method Not Allowed", {
        status: 405
      });
    }

    const key = decodeURIComponent(
      url.pathname.slice(1)
    );

    if (!key) {
      return new Response("FO3 Image Server Online");
    }

    if (!env.IMAGES) {
      return new Response("R2 binding missing", {
        status: 500
      });
    }

    const object = await env.IMAGES.get(key);

    if (!object) {
      return new Response("Image not found: " + key, {
        status: 404
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("ETag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(object.body, {
      headers
    });
  }
};
