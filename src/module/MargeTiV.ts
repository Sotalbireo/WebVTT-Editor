/// <reference path="../interface.d.ts" />
import * as fs from 'fs';
import Ai from '../module/Ai';

export default class MargeViT {
	private file: string = '';
	private text: string[] = [];
	private textLen: number = -1;
	private cues: Cue[] = [];
	private cuesLen: number = -1;
	private cueRE = /(?:^.*?$)?([\d: .]+-->.+)\n([\s\S]+?[^\n])$/img;

	public preCheck(attr: MargeTiV_attr) {
		// 原稿ファイル読み込み（複数行の改行は無視）
		this.file = fs.readFileSync(attr.txtPath, 'utf8');
		this.file = this.file.replace(/\r\n?/g, '\n').replace(/\n{2,}/g, '\n').trim();
		// 行ごとに区切る
		this.text = this.file.split('\n');
		// 行数かぞえる
		this.textLen = this.text.length;

		this.file = '';
		// 字幕ファイル読み込み
		this.file = fs.readFileSync(attr.vttPath, 'utf8');
		this.cues = this.cueParse(this.file);
		// cue数かぞえる
		this.cuesLen = this.cues.length;
		// 原稿行数と一致するか（足りなきゃきれるし多けりゃあふれる）
		if (this.textLen !== this.cuesLen) {
			throw new Error(`Not Equal Lengths: txt=>${this.textLen}, cue=>${this.cuesLen}.`);
		}
	}

	public exe(attr: MargeTiV_attr) {
		this.preCheck({txtPath: attr.txtPath, vttPath: attr.vttPath});

		// cueの仮文章と原稿の文章を差し替え
		for (let i = 0; i < this.textLen; ++i) {
			this.cues[i].placehold = this.text[i];
		}
		// Cue.timestampを目標にCue.placeholdを置換
		this.file = this.cueReplace();
		// ファイルに書戻し
		// [INFO] 書戻し先VTTを別途指定されていなければ、元VTTに書く
		attr.outPath = attr.outPath || attr.vttPath;
		fs.writeFile(attr.outPath, this.file, 'utf8', (err) => {
			if (err) {
				throw err;
			} else {
				Ai.popinAlert({
					type: 'info',
					head: 'Sucseed:',
					str: `writeFile(); path=>"${attr.outPath}"`
				});
			}
		});

		return true;
	}

	private cueParse(str: string): Cue[] {
		const cues: Cue[] = [];
		let parsed: RegExpExecArray|null;
		while (null !== (parsed = this.cueRE.exec(str))) {
			cues.push({
				timestamp: parsed[1],
				placehold: parsed[2]
			});
		}
		return cues;
	}

	private cueReplace() {
		const cues = this.cues;
		return this.file.replace(this.cueRE, (substr: string, ...args: string[]) => {
			for (let i = 0; i < cues.length; ++i) {
				if (cues[i].timestamp === args[0]) {
					const t = `${args[0]}\n${cues[i].placehold}`;
					cues.splice(i, 1);
					return t;
				}
			}
			return substr;
		});
	}

}
