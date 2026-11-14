/* Dynamic SVG avatar & shop item previews */
    // -----------------------------------------------------------------------
    // 4. DYNAMIC SVG AVATAR & SHOP ITEM PREVIEW GENERATORS
    // -----------------------------------------------------------------------
    function buildAvatarSVG(skinId, hairStyle, hairColorId, outfitId, activity = 'idle') {
      const skin = SKIN_TONES.find(s => s.id === skinId) || SKIN_TONES[1];
      const hair = HAIR_COLORS.find(h => h.id === hairColorId) || HAIR_COLORS[0];

      // Hair SVG Layers (including detailed Braids!)
      let backHairSVG = '';
      let frontHairSVG = '';
      if (hairStyle === 'braids') {
        backHairSVG = `
          <!-- Long Textured Box Braids framing behind shoulders -->
          <g fill="${hair.hex}">
            <rect x="50" y="56" width="7" height="106" rx="3.5" />
            <rect x="59" y="54" width="7" height="112" rx="3.5" />
            <rect x="114" y="54" width="7" height="112" rx="3.5" />
            <rect x="123" y="56" width="7" height="106" rx="3.5" />
          </g>
          <!-- Braid Segment Beads / Ties -->
          <g fill="#38bdf8">
            <rect x="50" y="150" width="7" height="4" rx="1" />
            <rect x="59" y="154" width="7" height="4" rx="1" />
            <rect x="114" y="154" width="7" height="4" rx="1" />
            <rect x="123" y="150" width="7" height="4" rx="1" />
          </g>
        `;
        frontHairSVG = `
          <!-- Crown Cornrow Partings & Front Framing Braids -->
          <path d="M58 60 Q62 37 90 37 Q118 37 122 60 Q106 47 90 47 Q74 47 58 60 Z" fill="${hair.hex}" />
          <line x1="75" y1="39" x2="73" y2="51" stroke="#000000" stroke-width="1.2" opacity="0.35" />
          <line x1="90" y1="37" x2="90" y2="48" stroke="#000000" stroke-width="1.2" opacity="0.35" />
          <line x1="105" y1="39" x2="107" y2="51" stroke="#000000" stroke-width="1.2" opacity="0.35" />
          <!-- Front Shoulder Braids -->
          <rect x="55" y="60" width="6.5" height="96" rx="3.2" fill="${hair.hex}" />
          <rect x="118.5" y="60" width="6.5" height="96" rx="3.2" fill="${hair.hex}" />
          <circle cx="58.2" cy="148" r="3" fill="#facc15" />
          <circle cx="121.7" cy="148" r="3" fill="#facc15" />
        `;
      } else if (hairStyle === 'long') {
        backHairSVG = `<path d="M56 54 Q46 110 54 148 L126 148 Q134 110 124 54 Z" fill="${hair.hex}" />`;
        frontHairSVG = `<path d="M58 58 Q90 36 122 58 Q116 40 90 40 Q64 40 58 58 Z" fill="${hair.hex}" />`;
      } else if (hairStyle === 'bun') {
        backHairSVG = `<circle cx="90" cy="30" r="16" fill="${hair.hex}" />`;
        frontHairSVG = `<path d="M58 58 Q90 38 122 58 Q118 42 90 42 Q62 42 58 58 Z" fill="${hair.hex}" />`;
      } else if (hairStyle === 'messy') {
        frontHairSVG = `
          <path d="M56 62 Q54 36 90 34 Q126 36 124 62 Q112 48 98 54 Q90 44 80 54 Q68 48 56 62 Z" fill="${hair.hex}" />
          <path d="M72 38 L78 28 L86 36 L95 26 L104 37" fill="${hair.hex}" />
        `;
      } else {
        frontHairSVG = `<path d="M59 56 Q62 38 90 38 Q118 38 121 56 Q106 46 90 46 Q74 46 59 56 Z" fill="${hair.hex}" />`;
      }

      // Outfit SVG Layers (Clearly showing Tops AND Pants/Bottoms!)
      let outfitSVG = '';
      if (outfitId === 'gown') {
        outfitSVG = `
          <rect x="72" y="198" width="13" height="62" rx="6" fill="${skin.hex}" />
          <rect x="95" y="198" width="13" height="62" rx="6" fill="${skin.hex}" />
          <path d="M71 252 L86 252 L86 266 L67 266 Q67 258 71 252 Z" fill="#e2e8f0" />
          <path d="M94 252 L109 252 L113 266 L94 266 Z" fill="#e2e8f0" />
          <path d="M56 108 L124 108 L134 206 L46 206 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
          <line x1="90" y1="112" x2="90" y2="206" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4 4" />
          <path d="M76 108 Q90 122 104 108" fill="none" stroke="#94a3b8" stroke-width="2" />
          <path d="M56 108 L40 138 L55 144 L64 122 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
          <path d="M124 108 L140 138 L125 144 L116 122 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
        `;
      } else if (outfitId === 'gymset') {
        outfitSVG = `
          <path d="M64 174 L116 174 L114 256 L96 256 L90 202 L84 256 L66 256 Z" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
          <line x1="67" y1="178" x2="68" y2="252" stroke="#38bdf8" stroke-width="2.5" />
          <line x1="113" y1="178" x2="112" y2="252" stroke="#38bdf8" stroke-width="2.5" />
          <rect x="62" y="254" width="24" height="12" rx="5" fill="#f8fafc" />
          <rect x="94" y="254" width="24" height="12" rx="5" fill="#f8fafc" />
          <path d="M62 108 L118 108 L116 176 L64 176 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
          <path d="M74 108 Q90 126 106 108" fill="${skin.hex}" />
        `;
      } else if (outfitId === 'hoodie') {
        outfitSVG = `
          <path d="M61 178 L119 178 L117 256 L95 256 L90 204 L85 256 L63 256 Z" fill="#1e293b" />
          <rect x="60" y="206" width="8" height="18" rx="2" fill="#334155" />
          <rect x="112" y="206" width="8" height="18" rx="2" fill="#334155" />
          <rect x="61" y="254" width="25" height="13" rx="4" fill="#475569" />
          <rect x="94" y="254" width="25" height="13" rx="4" fill="#475569" />
          <path d="M52 106 L128 106 L132 184 L48 184 Z" fill="#0284c7" />
          <path d="M68 154 L112 154 L116 180 L64 180 Z" fill="#0369a1" />
          <line x1="83" y1="114" x2="83" y2="136" stroke="#e0f2fe" stroke-width="2" />
          <line x1="97" y1="114" x2="97" y2="136" stroke="#e0f2fe" stroke-width="2" />
          <path d="M52 108 L36 164 L50 168 L62 126 Z" fill="#0284c7" />
          <path d="M128 108 L144 164 L130 168 L118 126 Z" fill="#0284c7" />
        `;
      } else if (outfitId === 'streetwear') {
        outfitSVG = `
          <path d="M64 176 L116 176 L113 256 L95 256 L90 202 L85 256 L67 256 Z" fill="#090d16" />
          <rect x="62" y="254" width="24" height="13" rx="4" fill="#38bdf8" />
          <rect x="94" y="254" width="24" height="13" rx="4" fill="#38bdf8" />
          <rect x="74" y="108" width="32" height="72" fill="#f8fafc" />
          <path d="M52 106 L78 106 L78 180 L50 180 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
          <path d="M102 106 L128 106 L130 180 L102 180 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
          <path d="M52 108 L36 164 L50 168 L60 126 Z" fill="#1e293b" />
          <path d="M128 108 L144 164 L130 168 L120 126 Z" fill="#1e293b" />
        `;
      } else {
        outfitSVG = `
          <path d="M64 178 L116 178 L114 256 L95 256 L90 204 L85 256 L66 256 Z" fill="#111827" />
          <line x1="75" y1="184" x2="75" y2="252" stroke="#374151" stroke-width="1.2" />
          <line x1="105" y1="184" x2="105" y2="252" stroke="#374151" stroke-width="1.2" />
          <rect x="62" y="255" width="24" height="11" rx="4" fill="#78350f" />
          <rect x="94" y="255" width="24" height="11" rx="4" fill="#78350f" />
          <path d="M52 106 L128 106 L132 190 L48 190 Z" fill="#1e1b4b" stroke="#facc15" stroke-width="1.5" />
          <polygon points="74,106 90,144 82,106" fill="#312e81" />
          <polygon points="106,106 90,144 98,106" fill="#312e81" />
          <path d="M77 112 Q90 132 103 112" fill="none" stroke="#facc15" stroke-width="2.5" />
          <path d="M52 108 L36 164 L50 168 L60 126 Z" fill="#1e1b4b" />
          <path d="M128 108 L144 164 L130 168 L120 126 Z" fill="#1e1b4b" />
        `;
      }

      // Activity-specific Arm & Prop Overlays
      let armsAndPropSVG = `
        <path d="M56 114 L40 168" stroke="${skin.hex}" stroke-width="12" stroke-linecap="round" />
        <path d="M124 114 L140 168" stroke="${skin.hex}" stroke-width="12" stroke-linecap="round" />
      `;
      let seatedLapOverlay = '';

      if (activity === 'couch') {
        // Seated pose: bent knees & relaxed arms resting on lap
        seatedLapOverlay = `
          <rect x="60" y="182" width="60" height="22" rx="10" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
        `;
        armsAndPropSVG = `
          <path d="M56 114 L52 162 L76 176" fill="none" stroke="${skin.hex}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M124 114 L128 162 L104 176" fill="none" stroke="${skin.hex}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
        `;
      } else if (activity === 'desk') {
        // Leaning forward typing at the keyboard
        armsAndPropSVG = `
          <path d="M56 114 L42 146 L68 156" fill="none" stroke="${skin.hex}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M124 114 L104 148 L82 156" fill="none" stroke="${skin.hex}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
        `;
      } else if (activity === 'bookshelf') {
        // Holding an open hardcover book in front of chest!
        armsAndPropSVG = `
          <path d="M56 114 L54 152 L74 156" fill="none" stroke="${skin.hex}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M124 114 L126 152 L106 156" fill="none" stroke="${skin.hex}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Open Book Prop -->
          <path d="M64 134 L90 140 L116 134 L116 168 L90 174 L64 168 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
          <path d="M68 136 L90 142 L112 136 L112 164 L90 170 L68 164 Z" fill="#f8fafc" />
          <line x1="90" y1="142" x2="90" y2="170" stroke="#94a3b8" stroke-width="1.5" />
          <line x1="73" y1="145" x2="86" y2="148" stroke="#64748b" stroke-width="1.2" />
          <line x1="73" y1="152" x2="86" y2="155" stroke="#64748b" stroke-width="1.2" />
          <line x1="94" y1="148" x2="107" y2="145" stroke="#64748b" stroke-width="1.2" />
          <line x1="94" y1="155" x2="107" y2="152" stroke="#64748b" stroke-width="1.2" />
        `;
      }

      const bodyTilt = activity === 'desk' ? 'transform="rotate(-7 90 180)"' : '';

      return `
        <svg viewBox="0 0 180 280" width="180" height="280" class="overflow-visible" xmlns="http://www.w3.org/2000/svg">
          ${backHairSVG}
          <path d="M56 114 L40 168" stroke="${skin.hex}" stroke-width="12" stroke-linecap="round" />
          <path d="M124 114 L140 168" stroke="${skin.hex}" stroke-width="12" stroke-linecap="round" />
          ${outfitSVG}
          <rect x="81" y="92" width="18" height="20" rx="6" fill="${skin.shadow}" />
          <rect x="60" y="42" width="60" height="60" rx="28" fill="${skin.hex}" />
          <circle cx="59" cy="74" r="6" fill="${skin.shadow}" />
          <circle cx="121" cy="74" r="6" fill="${skin.shadow}" />
          <circle cx="77" cy="72" r="4" fill="#0f172a" />
          <circle cx="103" cy="72" r="4" fill="#0f172a" />
          <circle cx="78.5" cy="70.5" r="1.3" fill="#ffffff" />
          <circle cx="104.5" cy="70.5" r="1.3" fill="#ffffff" />
          <line x1="71" y1="64" x2="83" y2="66" stroke="${hair.hex}" stroke-width="2.5" stroke-linecap="round" />
          <line x1="109" y1="64" x2="97" y2="66" stroke="${hair.hex}" stroke-width="2.5" stroke-linecap="round" />
          <path d="M82 85 Q90 91 98 85" fill="none" stroke="#0f172a" stroke-width="2.3" stroke-linecap="round" />
          ${frontHairSVG}
        </svg>
      `;
    }

    // Custom SVG Visual Previews for Shop Outfits (Top + Pants clearly illustrated!)
    function getOutfitPreviewSVG(id) {
      if (id === 'gown') {
        return `<svg viewBox="0 0 120 90" class="w-full h-full"><path d="M40 14 L80 14 L88 74 L32 74 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/><line x1="60" y1="16" x2="60" y2="74" stroke="#cbd5e1" stroke-dasharray="3 3"/><text x="60" y="85" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="Inter">Starter Gown</text></svg>`;
      }
      if (id === 'gymset') {
        return `<svg viewBox="0 0 120 90" class="w-full h-full">
          <!-- Compression Top -->
          <path d="M42 10 L78 10 L76 42 L44 42 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <!-- Joggers / Pants -->
          <path d="M44 44 L76 44 L74 82 L63 82 L60 56 L57 82 L46 82 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
        </svg>`;
      }
      if (id === 'hoodie') {
        return `<svg viewBox="0 0 120 90" class="w-full h-full">
          <!-- Ice Hoodie -->
          <path d="M36 10 L84 10 L86 44 L34 44 Z" rx="4" fill="#0284c7"/>
          <path d="M36 12 L24 38 L32 41 L38 22 Z" fill="#0284c7"/>
          <path d="M84 12 L96 38 L88 41 L82 22 Z" fill="#0284c7"/>
          <!-- Cargo Sweatpants -->
          <path d="M42 46 L78 46 L76 82 L63 82 L60 58 L57 82 L44 82 Z" fill="#334155"/>
        </svg>`;
      }
      if (id === 'streetwear') {
        return `<svg viewBox="0 0 120 90" class="w-full h-full">
          <!-- Bomber Jacket -->
          <path d="M36 10 L84 10 L85 43 L35 43 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
          <rect x="53" y="10" width="14" height="33" fill="#f8fafc"/>
          <!-- Black Denim Pants -->
          <path d="M44 45 L76 45 L74 82 L63 82 L60 57 L57 82 L46 82 Z" fill="#090d16" stroke="#475569" stroke-width="1"/>
        </svg>`;
      }
      return `<svg viewBox="0 0 120 90" class="w-full h-full">
        <!-- Executive Suit Blazer -->
        <path d="M36 10 L84 10 L85 44 L35 44 Z" fill="#1e1b4b" stroke="#facc15" stroke-width="1.5"/>
        <polygon points="52,10 60,28 68,10" fill="#f8fafc"/>
        <!-- Dress Trousers -->
        <path d="M44 46 L76 46 L74 82 L63 82 L60 58 L57 82 L46 82 Z" fill="#111827" stroke="#64748b" stroke-width="1"/>
      </svg>`;
    }

    // Custom SVG Visual Previews for Room Furniture & Decor
    function getRoomItemPreviewSVG(id) {
      const svgs = {
        rug: `<svg viewBox="0 0 120 80" class="w-full h-full"><ellipse cx="60" cy="44" rx="46" ry="20" fill="#1e3a5f" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 3"/><ellipse cx="60" cy="44" rx="34" ry="13" fill="none" stroke="#7dd3fc" stroke-width="1"/></svg>`,
        plant: `<svg viewBox="0 0 120 80" class="w-full h-full"><path d="M48 48 L72 48 L68 72 L52 72 Z" fill="#e2e8f0"/><path d="M60 48 Q40 24 35 36 Q48 46 60 48 Z" fill="#10b981"/><path d="M60 48 Q80 22 86 35 Q72 46 60 48 Z" fill="#059669"/><path d="M60 48 Q50 14 60 10 Q70 14 60 48 Z" fill="#34d399"/></svg>`,
        painting: `<svg viewBox="0 0 120 80" class="w-full h-full"><rect x="26" y="14" width="68" height="52" rx="4" fill="#451a03" stroke="#d97706" stroke-width="2.5"/><rect x="32" y="20" width="56" height="40" fill="#0f172a"/><circle cx="74" cy="31" r="7" fill="#f59e0b"/><polygon points="32,60 52,35 70,60" fill="#38bdf8"/><polygon points="52,60 70,40 88,60" fill="#818cf8"/></svg>`,
        couch: `<svg viewBox="0 0 120 80" class="w-full h-full"><rect x="22" y="22" width="76" height="24" rx="6" fill="#1e3a5f" stroke="#38bdf8" stroke-width="1.5"/><rect x="18" y="42" width="84" height="14" rx="4" fill="#254875"/><rect x="14" y="34" width="12" height="26" rx="4" fill="#1b3454"/><rect x="94" y="34" width="12" height="26" rx="4" fill="#1b3454"/><rect x="30" y="30" width="14" height="13" rx="3" fill="#f59e0b"/></svg>`,
        neon: `<svg viewBox="0 0 120 80" class="w-full h-full"><rect x="18" y="22" width="84" height="36" rx="8" fill="#081226" stroke="#38bdf8" stroke-width="2"/><text x="60" y="45" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="13" fill="#7dd3fc">LOCK IN ❄️</text></svg>`,
        bookshelf: `<svg viewBox="0 0 120 80" class="w-full h-full"><rect x="36" y="10" width="48" height="62" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2"/><line x1="38" y1="30" x2="82" y2="30" stroke="#475569" stroke-width="2"/><line x1="38" y1="50" x2="82" y2="50" stroke="#475569" stroke-width="2"/><rect x="42" y="15" width="6" height="14" fill="#38bdf8"/><rect x="50" y="17" width="6" height="12" fill="#f43f5e"/><circle cx="60" cy="40" r="5" fill="#facc15"/></svg>`,
        window: `<svg viewBox="0 0 120 80" class="w-full h-full"><rect x="28" y="12" width="64" height="56" rx="4" fill="#0f2547" stroke="#475569" stroke-width="3"/><circle cx="76" cy="24" r="6" fill="#e0f2fe"/><line x1="60" y1="12" x2="60" y2="68" stroke="#475569" stroke-width="2"/><line x1="28" y1="40" x2="92" y2="40" stroke="#475569" stroke-width="2"/></svg>`,
        desk: `<svg viewBox="0 0 120 80" class="w-full h-full"><rect x="22" y="46" width="76" height="6" rx="2" fill="#475569"/><rect x="28" y="52" width="5" height="18" fill="#1e293b"/><rect x="87" y="52" width="5" height="18" fill="#1e293b"/><rect x="40" y="18" width="40" height="22" rx="3" fill="#090d16" stroke="#38bdf8" stroke-width="1.5"/><rect x="56" y="40" width="8" height="6" fill="#334155"/></svg>`,
        fireplace: `<svg viewBox="0 0 120 80" class="w-full h-full"><rect x="28" y="16" width="64" height="54" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/><path d="M44 70 L44 38 Q60 28 76 38 L76 70 Z" fill="#090d16"/><path d="M60 40 C68 50, 70 62, 60 66 C50 62, 52 50, 60 40 Z" fill="#f97316"/><path d="M60 48 C65 54, 66 62, 60 65 C54 62, 55 54, 60 48 Z" fill="#facc15"/></svg>`
      };
      return svgs[id] || '';
    }

