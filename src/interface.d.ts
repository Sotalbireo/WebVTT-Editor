interface Cue {
	timestamp: string,
	placehold: string,
}

interface MargeTiV_attr {
	txtPath: string,
	vttPath: string,
	outPath?: string
}

interface PopinAlertCue {
	type?: "danger"|"info",
	head?: string,
	str?: string
}

declare interface Ai {
	popinAlert(attr?: PopinAlertCue): void
}
