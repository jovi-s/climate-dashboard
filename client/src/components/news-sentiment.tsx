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
    const [newsData, setNewsData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewsSentiment = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND}/api/news-sentiment`);
                if (!response.ok) {
                    throw new Error("Failed to fetch news sentiment data");
                }
                const data = await response.json();
                setNewsData(data.report);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsSentiment();
    }, []);

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