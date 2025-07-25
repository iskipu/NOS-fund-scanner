import { useState, useEffect } from "react";

export default function ConsoleLogViewer() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // Save original console.log
        const originalLog = console.log;

        // Override console.log
        console.log = (...args) => {
            setLogs((prev) => [...prev, args.join(" ")]);
            originalLog(...args); // Still log to DevTools
        };

        // Cleanup: restore original console.log when component unmounts
        return () => {
            console.log = originalLog;
        };
    }, []);

    return (
        <div className="bg-console-dark-grey text-neon-green p-4 h-72 overflow-y-scroll rounded-lg shadow-md mt-8 w-full max-w-4xl mx-auto">
            <h3 className="text-lg font-bold mb-2">Console Output:</h3>
            {logs.map((log, idx) => (
                <div key={idx} className="font-mono text-sm">
                    {log}
                </div>
            ))}
        </div>
    );
}
