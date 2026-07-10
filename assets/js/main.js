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
