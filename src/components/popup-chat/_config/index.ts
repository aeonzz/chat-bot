import { useState, useEffect } from "react";
import axios from "axios";

export interface Topic {
  topic: string;
  category: string;
  description: string;
  examples: string[];
  icon: string;
}

export interface TopicsResponse {
  topics: Topic[];
  total: number;
  document_count: number;
  message: string;
}

/**
 * Custom hook to fetch dynamic topics from the API
 * Falls back to default topics if API call fails
 */
export function useTopics() {
  const [topics, setTopics] = useState<string[]>([
    "Code of Discipline",
    "DTR Violations",
    "Leave Filing",
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get<TopicsResponse>(
          import.meta.env.VITE_API_URL_TOPICS
        );

        // Extract the first example from each topic as the display text
        const dynamicTopics = response.data.topics.map(
          (topic) => topic.examples[0] || topic.topic
        );

        if (dynamicTopics.length > 0) {
          setTopics(dynamicTopics);
        }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setError("Failed to load topics, using defaults");
        // Keep default topics on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopics();
  }, []);

  return { topics, isLoading, error };
}
