/* Shared artwork for the homepage companion and the research-game hero. */
(() => {
    const art = `<svg class="mochi-art" viewBox="0 0 120 105" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <defs>
              <radialGradient id="mochi-jelly" cx=".37" cy=".22" r=".88">
                <stop stop-color="#fbfff3"/><stop offset=".35" stop-color="#dceebd"/><stop offset=".72" stop-color="#b9d68f"/><stop offset="1" stop-color="#ecf6d8"/>
              </radialGradient>
              <radialGradient id="mochi-bubble" cx=".3" cy=".25" r=".8">
                <stop stop-color="#fff" stop-opacity=".98"/><stop offset=".4" stop-color="#e9f6cf" stop-opacity=".86"/><stop offset="1" stop-color="#a9c77c" stop-opacity=".9"/>
              </radialGradient>
              <radialGradient id="mochi-shine"><stop stop-color="#fff" stop-opacity=".98"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
              <radialGradient id="mochi-eye" cx=".35" cy=".25" r=".8"><stop stop-color="#454c39"/><stop offset=".5" stop-color="#11170d"/><stop offset="1" stop-color="#020502"/></radialGradient>
            </defs>
            <g stroke="#465334" stroke-width="1.5" fill="url(#mochi-bubble)">
              <circle class="mochi-bubble bubble-top" cx="57" cy="9" r="6"/>
              <circle cx="40" cy="29" r="10"/><circle cx="73" cy="32" r="7"/>
              <circle class="mochi-bubble bubble-left" cx="12" cy="43" r="4"/>
              <circle cx="66" cy="21" r="1.6"/>
            </g>
            <path d="M7 87 C15 83 15 72 20 62 C26 43 35 32 51 32 C69 30 77 41 82 56 C88 73 99 79 113 83 C121 86 118 91 107 91 L96 91 C94 92 96 98 89 98 C82 96 80 95 74 97 C68 99 67 103 59 101 C52 97 49 97 42 99 C35 102 29 104 26 98 C23 92 20 92 12 93 C3 94 0 90 7 87Z" fill="url(#mochi-jelly)" stroke="#3f4d2e" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M8 89 C17 87 20 88 25 91 C30 96 28 100 35 98 M45 96 Q53 94 59 98 Q65 101 71 96 M78 94 Q85 91 90 95 M98 87 L112 87" stroke="#f8ffe9" stroke-width="2.4" stroke-linecap="round"/>
            <circle cx="79" cy="54" r="9" fill="url(#mochi-bubble)" stroke="#54613b" stroke-width="1.3"/>
            <ellipse cx="45" cy="41" rx="17" ry="6" fill="url(#mochi-shine)" transform="rotate(-22 45 41)"/>
            <ellipse cx="32" cy="85" rx="7" ry="10" fill="url(#mochi-shine)"/>
            <ellipse cx="76" cy="78" rx="7" ry="7" fill="url(#mochi-shine)"/>
            <ellipse cx="93" cy="87" rx="6" ry="5" fill="url(#mochi-shine)"/>
            <circle cx="67" cy="72" r="4" fill="url(#mochi-shine)"/>
            <g class="mochi-eyes">
              <g class="mochi-eye"><ellipse cx="36" cy="54" rx="4.4" ry="5.5" fill="url(#mochi-eye)"/><ellipse cx="34.9" cy="52.2" rx="1.4" ry="1.8" fill="white" opacity=".95"/></g>
              <g class="mochi-eye"><ellipse cx="58" cy="60" rx="5" ry="5.6" fill="url(#mochi-eye)"/><ellipse cx="56.7" cy="58.1" rx="1.6" ry="1.8" fill="white" opacity=".95"/></g>
            </g>
            <g class="mochi-happy-eyes" stroke="#28391b" stroke-width="2.4" stroke-linecap="round"><path d="M32 55 Q36 49 40 55"/><path d="M53 60 Q58 54 63 60"/></g>
            <g class="mochi-mouth"><circle cx="36" cy="70" r="6.2" fill="#f3f0ad" stroke="#687341" stroke-width="1.2"/><ellipse cx="33.4" cy="70" rx="3.4" ry="4.6" fill="#faf7cf" stroke="#899152" stroke-width="1"/><path d="M32 66 Q36 68 33 73" stroke="#fffde7" stroke-width="1.5" stroke-linecap="round"/></g>
          </svg>`;
    globalThis.MochiArt = {
        render(prefix = 'mochi') {
            if (!/^[a-z][a-z0-9-]*$/i.test(prefix)) throw new Error('Invalid artwork prefix');
            return art.replace(/id="mochi-/g, `id="${prefix}-mochi-`).replace(/url\(#mochi-/g, `url(#${prefix}-mochi-`);
        }
    };
})();
