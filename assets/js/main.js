/* ============================================================
   THEME SWITCHER — Material 3 (dark / light / system)
   ============================================================ */
(() => {
	const KEY = "theme";
	const root = document.documentElement;
	const media = window.matchMedia("(prefers-color-scheme: light)");
	const switcher = document.getElementById("theme-switcher");
	const trigger = document.getElementById("theme-trigger");
	const menuEl = document.getElementById("theme-menu");

	/* GitHub stat text colors per scheme (original HTML URLs are dark) */
	const STAT_COLORS = {
		dark: { title: "a78bfa", text: "e2e8f0", icon: "8b5cf6" },
		light: { title: "7c3aed", text: "374151", icon: "7c3aed" },
	};

	function getStored() {
		try {
			const v = localStorage.getItem(KEY);
			if (v === "light" || v === "dark" || v === "system") return v;
		} catch (e) {}
		return "system";
	}

	function getEffective(theme) {
		return theme === "system" ? (media.matches ? "light" : "dark") : theme;
	}

	/* Seed the original (dark-scheme) URLs once, before any swap. */
	document.querySelectorAll(".stat-img").forEach((img) => {
		if (!img.dataset.srcDark) img.dataset.srcDark = img.src;
	});

	function refreshStats(app) {
		const c = STAT_COLORS[app === "light" ? "light" : "dark"];
		document.querySelectorAll(".stat-img").forEach((img) => {
			const base = img.dataset.srcDark;
			if (!base) return;
			const src = base
				.replace(/title_color=[^&]+/, `title_color=${c.title}`)
				.replace(/text_color=[^&]+/, `text_color=${c.text}`)
				.replace(/icon_color=[^&]+/, `icon_color=${c.icon}`);
			if (img.src === src) return;
			const sk = document.getElementById(img.dataset.sk);
			if (sk) sk.classList.remove("hidden");
			img.classList.remove("loaded");
			img.src = src;
		});
	}

	function syncMenu(theme) {
		document.querySelectorAll(".theme-option").forEach((opt) => {
			opt.setAttribute("aria-checked", String(opt.dataset.themeValue === theme));
		});
	}

	function applyTheme(theme) {
		const app = getEffective(theme);
		root.dataset.theme = theme;
		root.dataset.appearance = app;
		try {
			localStorage.setItem(KEY, theme);
		} catch (e) {}
		const label = app === "light" ? "light" : "dark";
		if (trigger) trigger.setAttribute("aria-label", `Appearance: ${label}`);
		const mc = document.querySelector('meta[name="theme-color"]');
		if (mc) mc.setAttribute("content", app === "light" ? "#faf9f9" : "#0a0a0a");
		refreshStats(app);
		syncMenu(theme);
	}

	applyTheme(getStored());

	/* ── Open / close the dropdown ────────────────────────── */
	function setOpen(open) {
		if (!switcher || !trigger) return;
		switcher.dataset.open = String(open);
		trigger.setAttribute("aria-expanded", String(open));
	}

	if (trigger && menuEl) {
		trigger.addEventListener("click", (e) => {
			e.stopPropagation();
			setOpen(switcher.dataset.open !== "true");
		});

		menuEl.addEventListener("click", (e) => {
			const opt = e.target.closest(".theme-option");
			if (!opt) return;
			applyTheme(opt.dataset.themeValue);
			setOpen(false);
			trigger.focus();
		});
	}

	document.addEventListener("click", (e) => {
		if (switcher && !switcher.contains(e.target)) setOpen(false);
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") setOpen(false);
	});

	/* Follow OS theme changes while in system mode */
	const onChange = () => {
		if (getStored() === "system") applyTheme("system");
	};
	if (media.addEventListener) media.addEventListener("change", onChange);
	else if (media.addListener) media.addListener(onChange);
})();

/* Animated tab title — typewriter erase/retype */
const staticPart = 'Ash1421 | ';
const text = 'My Links';
let index = text.length;
let direction = -1;

setInterval(() => {
	document.title = staticPart + text.substring(0, index);
	if (index === 0) direction = 1;
	else if (index === text.length) direction = -1;
	index += direction;
}, 200);

/* Stat image skeleton removal */
document.querySelectorAll('.stat-img').forEach((img) => {
	const skId = img.dataset.sk;
	const sk = document.getElementById(skId);
	if (img.complete && img.naturalWidth) {
		img.classList.add('loaded');
		if (sk) sk.classList.add('hidden');
	} else {
		img.addEventListener('load', () => {
			img.classList.add('loaded');
			if (sk) sk.classList.add('hidden');
		});
		img.addEventListener('error', () => {
			if (sk) sk.innerHTML = '<span class="stat-err">Stats unavailable</span>';
		});
	}
});
