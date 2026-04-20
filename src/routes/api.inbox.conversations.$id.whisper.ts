import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/inbox/conversations/$id/whisper")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        let body: { text?: unknown; teachAi?: unknown } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const text = typeof body.text === "string" ? body.text.trim() : "";
        const teachAi = body.teachAi === true;

        if (!text) {
          return new Response(JSON.stringify({ error: "text is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (text.length > 2000) {
          return new Response(JSON.stringify({ error: "text too long (max 2000)" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        return Response.json({
          id: `wh_${Date.now()}`,
          conversationId: params.id,
          text,
          teachAi,
          createdAt: new Date().toISOString(),
        });
      },
    },
  },
});
