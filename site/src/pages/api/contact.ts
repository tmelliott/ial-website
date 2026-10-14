import type { APIRoute } from "astro";

export const POST: APIRoute = async () => {
  return new Response("The contact form is closed.", { status: 403 });
};
