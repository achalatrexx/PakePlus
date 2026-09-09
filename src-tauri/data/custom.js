window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug

const openExternal = (url) => {
    if (!url) return;

    try {
        // 1. PakePlus / Tauri (නවම version)
        if (window.__TAURI__?.core?.invoke) {
            window.__TAURI__.core.invoke('plugin:shell|open', { path: url });
            return;
        }

        // 2. පැරණි Tauri shell API
        if (window.__TAURI__?.shell?.open) {
            window.__TAURI__.shell.open(url);
            return;
        }

        // 3. Fallback - browser එකේ open කරනවා
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (err) {
        console.error('External open failed:', err);
        window.open(url, '_blank');
    }
};

const hookClick = (e) => {
    const origin = e.target.closest('a');
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');

    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Opening externally:', origin.href);
        openExternal(origin.href);
    }
};

// window.open() intercept කරනවා
window.open = function (url, target, features) {
    console.log('window.open → external:', url);
    openExternal(url);
    return null;
};

document.addEventListener('click', hookClick, { capture: true });