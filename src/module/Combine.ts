import * as fs from 'fs'
import * as path from 'path'

interface Cue {
	id?: string,
	timestamp: string,
	placehold: string,
	newText?: string
}

export default class Combine {
	private text: string[]
	private textLen: number
	private cues: Cue[]
	private cuesLen: number

	exe(textFilePath: string, vttFilePath: string) {
		let file: any
		// 文章ファイル読み込み（複数行の改行は無視）
		file = fs.readFileSync(textFilePath)
		file = file.replace(/\r\n?/g, "\n").replace(/\n{2,}/, "\n")
		// 行ごとに区切る
		this.text = file.split("\n")
		// 行数かぞえる
		this.textLen = this.text.length

		file = ''
		// 字幕ファイル読み込み
		file = fs.readFileSync(vttFilePath)
		this.cues = this.cueParse(file)
		// cue数かぞえる
		this.cuesLen = this.cues.length
		// 文章行数と一致するか（足りなきゃきれるし多けりゃあふれる）
		if(this.textLen !== this.cuesLen) return false
		// cueの仮文章と文章を差し替え
		for (let i =0; i < this.textLen; ++i) {
			this.cues[i].newText = this.text[i]
		}
		// Cue.timestampを目標にCue.placehold相当をCue.newTextで置換
	}
	cueParse(obj): Cue[] {
		console.log(obj)
		return [{timestamp:"hoge", placehold:'hoge'}]
	}
}
