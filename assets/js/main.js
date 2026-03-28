const staticPart = "Ash1421 | ";
const text = "My Links";

let index = text.length;
let direction = -1;

setInterval(() => {
	document.title = staticPart + text.substring(0, index);

	if (index === 0) {
		direction = 1;
	} else if (index === text.length) {
		direction = -1;
	}

	index += direction;
}, 200);
