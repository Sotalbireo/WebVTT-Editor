import * as fs from 'fs'

// interface vttCue {
// 	type: "cue",
// 	timing: number[],
// 	text: string,
// 	id?: string,
// 	settings?: vttCueSetting[]
// }

// interface vttRegion {
// 	type: "region",
// 	id?: string,
// 	lines?: number,
// 	regionanchor?: string,
// 	scroll?: "up"|"",
// 	viewportanchor?: string,
// 	width?: string
// }

// interface vttComment {
// 	type: "comment",
// 	text: string
// }

// interface vttStyle {

// }

// enum PositionAlignSetting {
// 	"line-left",
// 	"center",
// 	"line-right",
// 	"auto"
// }

// interface vttCueSetting {
// 	align?: "start"|"center"|"end"|"left"|"right",
// 	line?: number|string,
// 	position?: string,
// 	region?: string,
// 	size?: string,
// 	vertical? : ""|"rl"|"lr"
// }

interface fileInfo {
	lineTerminator: "crlf"|"lf"|"cr",
	hasBOM: boolean
}

export class VttParser {
	jschardet:any
	private fileinfo:fileInfo

	constructor(){
		this.jschardet = require('jschardet')
	}

	test(filepath:string) {
		const fd = fs.openSync(filepath, 'r')
		console.log(fd)
		const bin = new Buffer(10)
		fs.readSync(fd, bin, 0, 10, 0)
		console.log(bin)
	}

	parser(rawstr:string) {
		let encoding = this.jschardet.detect(rawstr).encoding.toLowerCase()
		if(encoding !== 'utf-8' && encoding !== 'ascii') {
			console.log(encoding)
			Log.notUTF8()
			return
		}

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
		// while()
		Verifications.isIntegar(12)
	}

	// regionVerify(v:string):boolean {

	// }
	detectLineTerminator = (s:any) => /\r\n/im.test(s) ? "crlf" : /\r/im.test(s) ? "cr" : "lf"
}

class Verifications {
	static percentage(v:string):boolean {
		let n
		if (null === (n = /(\d+?(?:\.\d+?)?)%/.exec(v))) return false;
		return Verifications.isBetweenNumber(parseInt(n[1],10), 0, 100, false)
	}
	static timestamp(v:string):boolean {
		const stamp = /(?:(\d*?)\:)?(\d*?)\:(\d*?)\.(\d*?)/.exec(v)!

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

	static isIntegar = (n:any) => Math.round(n) === n

	static filterFloat = (v:any) => /^(\-|\+)?[0-9]+(\.[0-9]+)?$/.test(v)? Number(v) : NaN

	static isBetweenNumber = (x:number, a:number, b:number, isInt=true) => {
		if(isInt && Math.round(x)!==x) return false
		return a < b ? a <= x && x <= b : b <= x && x <= a
	}
}

class Log {
	static notUTF8 = () => {
		console.error('ERR: Character code must UTF-8 ( with or without a BOM ).')
	}
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

	static invalidTimestamp = (l:number, cat:"Hour"|"Minute"|"Second"|"MilliSecond", val:string) => {
		let stamp = ''
		switch(cat) {
			case 'Hour':
				stamp = 'be a positive number of 2-digits or more. (ex: "00", "01", ...)'
				break
			case 'Minute':
				stamp = 'fit between "00" to "59" (and must 2-digits.)'
				break
			case 'Second':
				stamp = 'fit between "00" to "59" (and must 2-digits.)'
				break
			case 'MilliSecond':
				stamp = 'fit between "000" to "999" (and must 3-digits.)'
				break
		}
		console.error(`ERR: Invalid timestamp; line ${l}, ${cat}'s value must ${stamp}. But your value is "${val}".`)
	}
}
