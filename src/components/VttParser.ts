interface vttCue {
	type: "cue",
	timing: number[],
	text: string,
	id?: string,
	settings?: vttCueSetting[]
}

interface vttRegion {
	type: "region",
	id?: string,
	lines?: number,
	regionanchor?: string,
	scroll?: "up"|"none",
	viewportanchor?: string,
	width?: string
}

interface vttComment {
	type: "comment",
	text: string
}

interface vttStyle {

}

interface vttCueSetting {
	align?: "start"|"center"|"end"|"left"|"right",
	line?: number|string,
	position?: string,
	region?: string,
	size?: string,
	vertical? : "rl"|"lr",
}

interface fileInfo {
	lineTerminator: "crlf"|"lf"|"cr",
	hasBOM: boolean
}

class VttParser {

	constructor() {}
	parser() {
		// すべての「U+0000」を「U+FFFD」で置換
		// 改行をlfに統一
		// ファイルが6文字以上あり、かつファイル先頭6字が「WEBVTT」であることを確認する（偽なら終了）
		// ファイル先頭の7文字が「U+0020( )」「U+0009(\t)」「U+000A(\n)」以外だった場合終了
		// 8文字目以降の改行を除く最初の文字が存在しない場合終了
		// 以降ファイル末尾まで、コードポイントのシーケンスごとにブロックの処理をループ
	}

	regionVerify(v:vttRegion):boolean {

	}
}

class Verifications {
	static percentage(v:string):boolean {
		if (v.substr(-1) !== '%') return false;
		const f = Verifications.filterFloat(v.slice(-1))
		return Verifications.isBetweenNumber(f, 0, 100)
	}
	static timestamp(v:string):boolean {
		const stamp = /(?:(\d*?)\:)?(\d*?)\:(\d*?)\.(\d*?)/.exec(v)

		// Hour: 2桁以上の0以上の整数
		if(stamp[1].length < 2 || Number(stamp[1]) < 0) return false
		// Minute: 2桁の0-59の整数
		if(stamp[2].length !== 2 || !Verifications.isBetweenNumber(Number(stamp[2]), 0, 59)) return false
		// Second: 2桁の0-59の整数
		if(stamp[3].length !== 2 || !Verifications.isBetweenNumber(Number(stamp[3]), 0, 59)) return false
		// millisecond: 3桁の0-999の整数
		if(stamp[4].length !== 3 || !Verifications.isBetweenNumber(Number(stamp[4]), 0, 999)) return false

		return true
	}
	static filterFloat = v => /^(\-|\+)?[0-9]+(\.[0-9]+)?$/.test(v)? Number(v) : NaN

	static isBetweenNumber = (x:number, a:number, b:number) => {
		return a < b ? a <= x && x <= b : b <= x && x <= a
	}
}
