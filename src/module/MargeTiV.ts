/// <reference path="../interface.d.ts" />
import * as fs from 'fs'
import * as path from 'path'

export default class MargeViT {
	private file: string
	private text: string[]
	private textLen: number
	private cues: Cue[]
	private cuesLen: number
	private cueRE = /(?:^.*?$)?([\d: .]+-->.+)\n([\s\S]+?[^\n])$/img

	preCheck(attr: {txtPath: string, vttPath: string}) {
		// 文章ファイル読み込み（複数行の改行は無視）
		this.file = fs.readFileSync(attr.txtPath, 'utf8')
		this.file = this.file.replace(/\r\n?/g, "\n").replace(/\n{2,}/g, "\n").trim()
		// 行ごとに区切る
		this.text = this.file.split("\n")
		// 行数かぞえる
		this.textLen = this.text.length

		this.file = ''
		// 字幕ファイル読み込み
		this.file = fs.readFileSync(attr.vttPath, 'utf8')
		this.cues = this.cueParse(this.file)
		// cue数かぞえる
		this.cuesLen = this.cues.length
		// 文章行数と一致するか（足りなきゃきれるし多けりゃあふれる）
		if(this.textLen !== this.cuesLen)
			throw `Not Equal Lengths: txt=>${this.textLen}, cue=>${this.cuesLen}.`;
	}

	exe(attr: {txtPath: string, vttPath: string}) {
		this.preCheck({txtPath:attr.txtPath, vttPath:attr.vttPath})

		// cueの仮文章と文章を差し替え
		for (let i =0; i < this.textLen; ++i) {
			this.cues[i].placehold = this.text[i]
		}
		// Cue.timestampを目標にCue.placehold相当をCue.newTextで置換
		this.file = this.cueReplace()
		// ファイルに書き戻し：[TODO]いずれここも変数に。というか元ファイルに書き戻してよさそう。
		fs.writeFileSync(path.resolve(path.join(__dirname, '../data/subtitle_with_note.vtt')), this.file, 'utf8')
		return true
	}



	private cueParse(str: string): Cue[] {
		let cues: Cue[] = []
		let parsed: RegExpExecArray|null
		while(null !== (parsed = this.cueRE.exec(str))) {
			cues.push({
				timestamp: parsed[1],
				placehold: parsed[2]
			})
		}
		return cues
	}

	private cueReplace() {
		let cues = this.cues
		return this.file.replace(this.cueRE, (substr: string, ...args: string[])=>{
			for(let i = 0; i < cues.length; ++i) {
				if(cues[i].timestamp === args[0]) {
					let t = `${args[0]}\n${cues[i].placehold}`
					cues.splice(i, 1)
					return t
				}
			}
			return substr
		})
	}



}
