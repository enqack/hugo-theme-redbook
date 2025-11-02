(function() {
    const defaults = {
        duration: 1000,
        easing: 'swing',
        offset: 0,
        fadein: 'slow',
        fadeout: 'slow',
        scrolloffset: 0,
        position: 'fixed',
        zIndex: 999
    };

    const getData = (el, name, fallback) => {
        const v = el.getAttribute('data-' + name);
        if (v == null) return fallback;
        if (v === 'true') return true;
        if (v === 'false') return false;
        if (!isNaN(v) && v.trim() !== '') return Number(v);
        return v;
    };

    const speedToMs = (val) => {
        if (typeof val === 'number') return val;
        if (val === 'fast') return 200;
        if (val === 'slow') return 600;
        return 400;
    };

    const EASING = {
        linear: t => t,
        swing: t => 0.5 - Math.cos(Math.PI * t) / 2
    };

    const animateScrollTo = (to, duration, easing, done) => {
        const start = window.pageYOffset || document.documentElement.scrollTop || 0;
        const change = to - start;
        const ease = EASING[easing] || EASING.swing;
        const startTime = performance.now();

        const step = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const y = start + change * ease(t);
        window.scrollTo(0, Math.round(y));
        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            done && done();
        }
        };
        requestAnimationFrame(step);
    };

    const fade = (el, type, ms) => {
        ms = speedToMs(ms);
        el.style.transition = `opacity ${ms}ms`;
        if (type === 'in') {
        if (getComputedStyle(el).display === 'none') el.style.display = 'block';
        el.offsetWidth;
        el.style.opacity = '1';
        } else {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.display = 'none';
        }, ms);
        }
    };

    const initBackToTop = () => {
        const elem = document.getElementById('backtotop-fixed');
        if (!elem) return;

        const scrollOffset = getData(elem, 'backtotop-fixed-scroll-offset', defaults.scrolloffset);
        const fadeIn = getData(elem, 'backtotop-fixed-fadein', defaults.fadein);
        const fadeOut = getData(elem, 'backtotop-fixed-fadeout', defaults.fadeout);
        const duration = getData(elem, 'backtotop-duration', defaults.duration);
        const easing = getData(elem, 'backtotop-easing', defaults.easing);
        const offset = getData(elem, 'backtotop-offset', defaults.offset);

        elem.style.position = defaults.position;
        elem.style.zIndex = defaults.zIndex;
        elem.style.display = 'none';
        elem.style.opacity = '0';

        // Show/hide logic on scroll
        let visible = false;
        const onScroll = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        if (y > scrollOffset && !visible) {
            fade(elem, 'in', fadeIn);
            visible = true;
        } else if (y <= scrollOffset && visible) {
            fade(elem, 'out', fadeOut);
            visible = false;
        }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Click scroll-to-top logic
        elem.addEventListener('click', (e) => {
        e.preventDefault();
        animateScrollTo(offset || 0, duration, easing);
        });
    };

    window.addEventListener('load', initBackToTop);
})();