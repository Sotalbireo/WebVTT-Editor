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
	scroll?: "up"|"",
	viewportanchor?: string,
	width?: string
}

interface vttComment {
	type: "comment",
	text: string
}

interface vttStyle {

}

enum PositionAlignSetting {
	"line-left",
	"center",
	"line-right",
	"auto"
}

interface vttCueSetting {
	align?: "start"|"center"|"end"|"left"|"right",
	line?: number|string,
	position?: string,
	region?: string,
	size?: string,
	vertical? : ""|"rl"|"lr"
}

interface fileInfo {
	lineTerminator: "crlf"|"lf"|"cr",
	hasBOM: boolean
}

class VttParser {
	private fileinfo:fileInfo

	constructor() {}
	parser(rawstr:string) {
		this.fileinfo.lineTerminator = this.detectLineTerminator(rawstr);

		// すべての「U+0000」を「U+FFFD」で置換, 改行をlfに統一
		rawstr = rawstr.replace("\u0000","\uFFFD").replace(/\r\n?/ig, "\n")
		// ファイルが6文字以上あり、かつファイル先頭6字が「WEBVTT」であることを確認する（偽なら終了）
		// ファイル先頭の7文字が「U+0020( )」「U+0009(\t)」「U+000A(\n)」以外だった場合終了
		if(rawstr.length < 6 || !/^WEBVTT[\u0020\t\n]/.test(rawstr.substr(0,7))) {
			Log.notExistSignature()
			return
		}
		// 8文字目以降の改行を除く最初の文字が存在しない場合終了
		if(!/\w/.test(rawstr.substr(7))) return

		// 以降ファイル末尾まで、コードポイントのシーケンスごとにブロックの処理をループ
		while()
	}

	regionVerify(v:string):boolean {

	}
	detectLineTerminator = s => /\r\n/im.test(s) ? "crlf" : /\r/im.test(s) ? "cr" : "lf"
}

class Verifications {
	static percentage(v:string):boolean {
		let n
		if (null === (n = /(\d+?(?:\.\d+?)?)%/.exec(v))) return false;
		return Verifications.isBetweenNumber(n[1], 0, 100, false)
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

	static anchor = (v:string) => {
		let p = v.split(',')
		return Verifications.percentage(p[0]) && Verifications.percentage(p[1])
	}

	static isIntegar = n => Math.round(n) === n

	static filterFloat = v => /^(\-|\+)?[0-9]+(\.[0-9]+)?$/.test(v)? Number(v) : NaN

	static isBetweenNumber = (x:number, a:number, b:number, isInt=true) => {
		if(isInt && Math.round(x)!==x) return false
		return a < b ? a <= x && x <= b : b <= x && x <= a
	}
}

class Log {
	static notExistSignature = () => {
		console.error('ERR: Not existing "WEBVTT" at top of file.')
	}
	static invalidAttribute = (l:number, category:string, attribute:string) => {
		console.error(`ERR: Invalid attribute; line ${l}, "${category}::${attribute}".`)
	}
	static invalidValue = (l:number, attribute:string, value:string) => {
		console.error(`ERR: Invalid value(s); line ${l}, "${attribute} => ${value}".`)
	}

	static generalError = (l:number) => {
		console.error(`ERR: General error; Probably line ${l}.`)
	}

	static invalidTimestamp = (l:number, cat:"Hour"|"Minute"|"Second"|"MilliSecond", val:number) {
		let stamp
		switch(cat) {
			case 'Hour':
				stamp = 0
				break
			case 'Minute':
				stamp = 'between "00" to "59"'
				break
			case 'Second':
				stamp = 'between "00" to "59"'
				break
			case 'MilliSecond':
				stamp = 'between "000" to "999" (and MUST 3-digits)'
				break
		}
		console.error(`ERR: Invalid timestamp; line ${l}, ${cat}'s value has to fit ${stamp}. But your value is "${val}".`)
	}
}
