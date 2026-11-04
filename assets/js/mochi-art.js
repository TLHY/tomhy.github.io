/* Shared pixel artwork for the homepage companion and research-game hero. */
(() => {
    globalThis.MochiArt = {
        render(prefix = 'mochi') {
            if (!/^[a-z][a-z0-9-]*$/i.test(prefix)) throw new Error('Invalid artwork prefix');
            return '<img class="mochi-art mochi-pixel-art" src="images/mochi-pixel.png" alt="" draggable="false" width="1254" height="1254">';
        }
    };
})();
