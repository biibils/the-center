"use client";

export function HijazLevantBlueprint() {
  return (
    <g aria-hidden="true">
      {/* =========================================================
          1. LAUT MEDITERANIA & PESISIR SYAM / MESIR (KIRI ATAS)
      ========================================================= */}
      <path
        d="M 0,0
           L 292,0
           C 289,28 284,56 277,84
           C 271,108 263,132 252,155
           C 242,175 231,192 216,204
           C 196,216 172,221 146,223
           C 126,225 112,216 96,216
           C 76,217 58,225 38,226
           L 0,227 Z"
        fill="url(#sea-hatch)"
        stroke="rgba(125, 211, 252, 0.42)"
        strokeWidth="1.4"
      />
      {/* Garis Batimetri Pesisir Mediterania */}
      <path
        d="M 282,0 C 276,55 262,118 242,162 C 218,198 175,212 115,212 L 0,215"
        fill="none"
        stroke="rgba(125, 211, 252, 0.16)"
        strokeWidth="0.9"
        strokeDasharray="3 4"
      />

      {/* =========================================================
          2. CABANG SUNGAI NIL & DELTA MESIR (KIRI TENGAH)
      ========================================================= */}
      <path
        d="M 105,222 L 88,265 L 72,340 L 65,435 M 105,222 L 118,262 L 88,265"
        fill="none"
        stroke="rgba(56, 189, 248, 0.35)"
        strokeWidth="1.2"
      />

      {/* =========================================================
          3. LAUT MERAH, TELUK SUEZ, SEMENANJUNG SINAI & TELUK AQABA
      ========================================================= */}
      <path
        d="M 152,244
           L 172,282
           L 204,334
           L 216,348
           C 224,352 232,345 236,334
           C 242,312 251,286 263,262
           L 272,244
           C 265,274 261,306 262,336
           C 263,348 269,360 278,374
           C 308,418 345,468 388,522
           C 412,552 434,578 452,600
           L 348,600
           C 316,556 284,510 254,462
           C 222,412 192,362 164,312
           L 144,254 Z"
        fill="url(#sea-hatch)"
        stroke="rgba(125, 211, 252, 0.48)"
        strokeWidth="1.5"
      />
      {/* Garis Tengah Alur Laut Merah */}
      <path
        d="M 162,262 L 214,344 M 267,256 L 266,344 L 332,442 L 402,542"
        fill="none"
        stroke="rgba(125, 211, 252, 0.16)"
        strokeWidth="0.9"
        strokeDasharray="4 6"
      />

      {/* =========================================================
          4. DANAU TIBERIAS, SUNGAI YORDAN & LAUT MATI (GREAT RIFT)
      ========================================================= */}
      {/* Danau Tiberias (Sea of Galilee) */}
      <ellipse
        cx="315"
        cy="98"
        rx="4"
        ry="7"
        fill="rgba(56, 189, 248, 0.25)"
        stroke="rgba(125, 211, 252, 0.55)"
        strokeWidth="1.1"
      />
      {/* Aliran Sungai Yordan */}
      <path
        d="M 315,105 C 313,120 315,134 312,150"
        fill="none"
        stroke="rgba(125, 211, 252, 0.5)"
        strokeWidth="1.2"
      />
      {/* Laut Mati (Dead Sea) */}
      <path
        d="M 308,151 C 315,151 317,172 315,188 C 313,195 307,195 305,188 C 303,172 304,151 308,151 Z"
        fill="rgba(56, 189, 248, 0.28)"
        stroke="rgba(125, 211, 252, 0.6)"
        strokeWidth="1.2"
      />

      {/* =========================================================
          5. KONTUR TOPOGRAFI PEGUNUNGAN HIJAZ / SARAWAT & SYAM
      ========================================================= */}
      {/* Gugusan Perbukitan Yudea / Al-Quds */}
      <path
        d="M 284,110 C 296,132 296,168 286,198 C 280,214 274,228 272,240"
        fill="none"
        stroke="rgba(224, 190, 123, 0.22)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {/* Pegunungan Hijaz & Sarawat sejajar pesisir Laut Merah */}
      <path
        d="M 294,252 C 306,296 328,342 365,392 C 405,445 452,505 498,572"
        fill="none"
        stroke="rgba(224, 190, 123, 0.24)"
        strokeWidth="1.1"
        strokeDasharray="5 5"
      />
      <path
        d="M 326,245 C 344,292 372,338 412,388 C 455,442 505,502 548,575"
        fill="none"
        stroke="rgba(224, 190, 123, 0.14)"
        strokeWidth="0.9"
        strokeDasharray="2 5"
      />
      {/* Cekungan Lembah Makkah / Hijaz Selatan */}
      <ellipse
        cx="556"
        cy="452"
        rx="46"
        ry="34"
        transform="rotate(-24 556 452)"
        fill="none"
        stroke="rgba(224, 190, 123, 0.18)"
        strokeWidth="0.9"
        strokeDasharray="3 4"
      />

      {/* =========================================================
          6. LABEL GEOGRAFIS & GRATICULE KOORDINAT ASLI
      ========================================================= */}
      {/* Garis Lintang & Bujur Referensi */}
      <g className="stroke-white/6" strokeWidth="0.8">
        <line x1="0" y1="165" x2="800" y2="165" strokeDasharray="6 6" />
        <line x1="0" y1="445" x2="800" y2="445" strokeDasharray="6 6" />
        <line x1="295" y1="0" x2="295" y2="600" strokeDasharray="6 6" />
        <line x1="560" y1="0" x2="560" y2="600" strokeDasharray="6 6" />
      </g>

      <g className="fill-white/25 font-mono text-[8px] tracking-[0.18em]">
        <text x="12" y="160">
          31°46&apos;N
        </text>
        <text x="12" y="440">
          21°25&apos;N
        </text>
        <text x="300" y="16">
          35°14&apos;E
        </text>
        <text x="565" y="16">
          39°49&apos;E
        </text>
      </g>

      {/* Label Wilayah */}
      <g className="fill-sky-300/40 font-mono text-[9px] tracking-[0.26em]">
        <text x="42" y="88">
          MEDITERRANEAN
        </text>
        <text x="42" y="102">
          SEA
        </text>
        <text x="232" y="468" transform="rotate(53 232,468)">
          RED SEA · BAHR AL-QULZUM
        </text>
        <text x="184" y="346" className="text-[7px]">
          SUEZ
        </text>
        <text x="274" y="314" className="text-[7px]">
          AQABA
        </text>
      </g>

      <g className="fill-[#e0be7b]/35 font-mono text-[9px] tracking-[0.28em]">
        <text x="206" y="284" className="text-[8px]">
          SINAI
        </text>
        <text x="362" y="142">
          BILAD AL-SHAM
        </text>
        <text x="492" y="295">
          ARABIAN SHIELD
        </text>
        <text x="458" y="492">
          HIJAZ
        </text>
      </g>

      {/* Scale Bar Kartografi (Kanan Bawah) */}
      <g transform="translate(625, 558)" opacity="0.7">
        <line
          x1="0"
          y1="0"
          x2="120"
          y2="0"
          stroke="#e0be7b"
          strokeWidth="1.2"
        />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#e0be7b" strokeWidth="1.2" />
        <line x1="60" y1="-3" x2="60" y2="3" stroke="#e0be7b" strokeWidth="1" />
        <line
          x1="120"
          y1="-4"
          x2="120"
          y2="4"
          stroke="#e0be7b"
          strokeWidth="1.2"
        />
        <text x="0" y="-7" className="fill-stone-400 font-mono text-[8px]">
          0
        </text>
        <text x="52" y="-7" className="fill-stone-400 font-mono text-[8px]">
          250
        </text>
        <text x="104" y="-7" className="fill-[#f5d99e] font-mono text-[8px]">
          500 KM
        </text>
      </g>

      {/* Compass Rose (Kiri Bawah) */}
      <g transform="translate(76, 520)" opacity="0.75">
        <circle
          cx="0"
          cy="0"
          r="30"
          fill="rgba(7, 11, 14, 0.6)"
          stroke="rgba(224,190,123,0.4)"
          strokeWidth="0.9"
        />
        <circle
          cx="0"
          cy="0"
          r="22"
          fill="none"
          stroke="rgba(125,211,252,0.25)"
          strokeDasharray="2 3"
          strokeWidth="0.8"
        />
        <polygon points="0,-26 3.5,-5 0,0 -3.5,-5" fill="#f5d99e" />
        <polygon points="0,26 3.5,5 0,0 -3.5,5" fill="rgba(224,190,123,0.35)" />
        <polygon
          points="-26,0 -5,3.5 0,0 -5,-3.5"
          fill="rgba(224,190,123,0.35)"
        />
        <polygon points="26,0 5,3.5 0,0 5,-3.5" fill="rgba(224,190,123,0.35)" />
        <text
          x="0"
          y="-34"
          textAnchor="middle"
          className="fill-[#f5d99e] font-mono text-[9px] font-bold"
        >
          N
        </text>
      </g>
    </g>
  );
}
