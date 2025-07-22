"use client";
import { useCallback, useEffect, useState } from "react";
import { Activity, ActivityCalendar } from "react-activity-calendar";

type GithubGraphProps = {
  username: string;
  blockMargin?: number;
  colorPallete?: string[];
};

export const GithubGraph = ({
  blockMargin,
  colorPallete,
}: GithubGraphProps) => {
  const [contribution, setContribution] = useState<Activity[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const contributions = await fetchContributionData();
      setContribution(contributions || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Error fetching contribution data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const label = {
    totalCount: `{{count}} contributions in the last year`,
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : contribution.length > 0 ? (
        <ActivityCalendar
          data={contribution}
          maxLevel={4}
          blockMargin={blockMargin ?? 2}
          loading={loading}
          labels={label}
          theme={{
            dark: colorPallete ?? [
              "#ebedf0",
              "#9be9a8",
              "#40c463",
              "#30a14e",
              "#216e39",
            ],
          }}
        />
      ) : (
        <p>No contribution data available.</p>
      )}
    </>
  );
};

async function fetchContributionData(): Promise<Activity[]> {
  const response = await fetch(`/api/github-contributions`);
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error("Error fetching contribution data");
  }

  return responseBody.data;
}