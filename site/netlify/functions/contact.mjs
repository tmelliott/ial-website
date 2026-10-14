export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  return new Response("The contact form is closed.", { status: 403 });
};
