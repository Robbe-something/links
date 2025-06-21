"use client"

import {useState} from "react";

export default function ItemDescriptionCell({ description }: { description: string | null }) {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered] = useState(false);
    const maxLength = 60;
    // Only trim and show ... if the text is longer than half the width (approximate by character count)
    // We'll use a rough estimate: 50 chars for half width, but allow expansion for more accurate UI
    const charLimit = 100; // adjust as needed for your font/width
    const isTrimmed = description && description.length > charLimit;
    const displayDescription = expanded || !isTrimmed
        ? description || '-'
        : (description ? description.slice(0, charLimit) + '...' : '-');
    return (
        <div
            className="text-xs font-normal text-muted-foreground mt-1 flex items-center gap-2 relative w-full max-w-[min(50vw,400px)]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ minHeight: '1.5em' }}
        >
            <span
                className={expanded ? 'whitespace-pre-line break-words' : 'truncate'}
                style={{
                    maxWidth: '100%',
                    display: 'inline-block',
                    wordBreak: 'break-word',
                    whiteSpace: expanded ? 'pre-line' : undefined
                }}
            >
                {displayDescription}
            </span>
            {isTrimmed && hovered && (
                !expanded ? (
                    <button
                        className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded hover:bg-gray-300 transition absolute right-0 top-0 z-10"
                        style={{transform: 'translateY(-100%)'}}
                        onClick={e => { e.stopPropagation(); setExpanded(true); }}
                    >
                        Show more
                    </button>
                ) : (
                    <button
                        className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded hover:bg-gray-300 transition absolute right-0 top-0 z-10"
                        style={{transform: 'translateY(-100%)'}}
                        onClick={e => { e.stopPropagation(); setExpanded(false); }}
                    >
                        Close
                    </button>
                )
            )}
        </div>
    );
}
