// Decorative background shapes from the template. Purely visual.
const Shapes = () => (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 hidden md:block overflow-hidden">
        {/* top-left: cloud + striped half circle */}
        <svg className="absolute top-14 -left-6 w-64" viewBox="0 0 260 230">
            <defs>
                <pattern id="stripes-h" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="5" fill="#fff" />
                    <rect y="5" width="10" height="5" fill="#000" />
                </pattern>
            </defs>
            <circle cx="175" cy="45" r="85" fill="#000" />
            <path d="M175 -40 A85 85 0 0 1 175 130 Z" fill="url(#stripes-h)" stroke="#000" strokeWidth="5" />
            <path d="M0 200 V40 A60 60 0 0 1 100 100 A60 60 0 0 1 225 200 Z" fill="#000" />
            <path d="M0 190 V30 A60 60 0 0 1 95 95 A55 55 0 0 1 200 190 Z" fill="#fff" stroke="#000" strokeWidth="5" />
        </svg>

        {/* top-right: star */}
        <svg className="absolute top-24 -right-8 w-44" viewBox="0 0 100 100">
            <polygon
                points="50,4 62,36 97,38 69,59 79,94 50,74 21,94 31,59 3,38 38,36"
                fill="#fff" stroke="#000" strokeWidth="3.5" strokeLinejoin="round"
            />
        </svg>

        {/* bottom-right: striped + black triangles */}
        <svg className="absolute -bottom-5 right-28 w-48" viewBox="0 0 200 200">
            <defs>
                <pattern id="stripes-d" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
                    <rect width="6" height="12" fill="#000" />
                    <rect x="6" width="6" height="12" fill="#fff" />
                </pattern>
            </defs>
            <polygon points="10,40 160,5 100,190" fill="url(#stripes-d)" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
            <polygon points="70,60 195,30 140,200" fill="#000" stroke="#000" strokeWidth="5" strokeLinejoin="round" />
        </svg>

        {/* right: white waves */}
        <svg className="absolute bottom-28 -right-2 w-36" viewBox="0 0 140 60" fill="none" stroke="#fff" strokeWidth="9">
            <path d="M0 15 q17.5 -14 35 0 t35 0 t35 0 t35 0" />
            <path d="M0 45 q17.5 -14 35 0 t35 0 t35 0 t35 0" />
        </svg>

        {/* bottom-left: arc */}
        <svg className="absolute -bottom-32 -left-32 w-80" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="125" fill="none" stroke="#000" strokeWidth="44" />
            <circle cx="150" cy="150" r="125" fill="none" stroke="#fff" strokeWidth="32" />
        </svg>
    </div>
);

export default Shapes;