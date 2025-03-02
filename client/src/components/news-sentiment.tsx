import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function NewsSentiment() {
    const [newsData, setNewsData] = useState<string | null>(() => {
        // Retrieve cached data from localStorage if available
        const cachedData = localStorage.getItem("newsData");
        return cachedData ? JSON.parse(cachedData) : null;
    });
    const [loading, setLoading] = useState(!newsData); // Set loading to false if data is already cached
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!newsData) { // Only fetch if data is not cached
            const fetchNewsSentiment = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/api/news-sentiment`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch news sentiment data");
                    }
                    const data = await response.json();
                    setNewsData(data.report);
                    localStorage.setItem("newsData", JSON.stringify(data.report)); // Cache the data
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("An unknown error occurred");
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchNewsSentiment();
        }
    }, [newsData]);

    return (
        <Card className="w-[1000px] mx-auto my-12">
            <CardHeader>
                <CardTitle>AI generated summary and sentiment from recent news articles</CardTitle>
                <CardDescription>Over the last month, relating to climate change, and global warming.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {newsData}
                    </ReactMarkdown>
                )}
            </CardContent>
        </Card>
    );
}