// src/app/api/github-contributions/route.ts

export async function GET() {
  const username = "kuslhhh";

  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    { cache: "no-store" }
  );

  const json = await response.json();

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch GitHub contributions" }),
      { status: 500 }
    );
  }

  // API returns { total: { lastYear: number }, contributions: Activity[] }
  // Each contribution already has { date, count, level } — exactly what react-activity-calendar needs
  return Response.json({ data: json.contributions });
}
