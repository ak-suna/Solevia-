import { useFontSize } from "../hooks/useFontSize";
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from "@heroicons/react/24/outline";
const FONT_SIZES = [
    { key: "normal", label: "A", icon: <MagnifyingGlassMinusIcon className="w-5 h-5" /> },
    { key: "large", label: "A", icon: <MagnifyingGlassPlusIcon className="w-5 h-5" /> },
];

export default function FontSizeToggle() {
    const [fontSize, setFontSize] = useFontSize();

    return (
        <div className="flex items-center gap-2 mt-4">
            <span className="text-gray-500 mr-2">Text size</span>
            {FONT_SIZES.map(opt => (
                <button
                    key={opt.key}
                    aria-label={`Set text size to ${opt.key}`}
                    className={`rounded-full border px-2 py-1 mx-1 flex items-center justify-center
            ${fontSize === opt.key ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300"}
            hover:bg-blue-100 transition`}
                    onClick={() => setFontSize(opt.key)}
                    type="button"
                >
                    <span className={`font-bold text-${opt.key === "normal" ? "base" : opt.key === "large" ? "lg" : "xl"}`}>
                        {opt.label}
                    </span>
                    <span className="ml-1">{opt.icon}</span>
                </button>
            ))}
        </div>
    );
}
