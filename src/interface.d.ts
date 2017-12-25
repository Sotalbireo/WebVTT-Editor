interface Cue {
	timestamp: string,
	placehold: string,
}

interface PopinAlertCue {
	type?: "danger"|"info",
	head?: string,
	str?: string
}
