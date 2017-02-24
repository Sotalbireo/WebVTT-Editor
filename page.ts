import * as fs from 'fs'
// import * as path from 'path'
// const filePath = path.join(__dirname, 'subtitle.ja.vtt')

let app      :Application
let appRoute :ApplicationRoute


class Video {
	private video :HTMLVideoElement
	constructor(_arg:{path:string,targ:string}) {
		// this.video = document.getElementById(query)! as HTMLVideoElement
		// this.video.addEventListener('timeupdate', this.updateCurrentTime)
	}
	formatTime(t:number, f=false) {
		let h = ('0' + Math.floor(t/3600)%60).slice(-2)
		let m = ('0' + Math.floor(t/60  )%60).slice(-2)
		let s = ('0' + Math.floor(t     )%60).slice(-2)
		return (f)? `${h}:${m}:${s}.${Math.floor(t*1000%60000).toString().slice(-3)}`: `${h}:${m}:${s}`
	}
	getCurrentTime(indent=0) {
		return this.video.currentTime + indent
	}
	seek(s:number) {
		this.video.currentTime += s
	}
	setTotalTime() {
		this.video.addEventListener("loadedmetadata", ()=>{
			document.getElementById('TotalTime')!.textContent = this.formatTime(this.video.duration)
		})
	}
	pp() {
		if(this.video.paused || this.video.ended){
			this.video.play()
		}else{
			this.video.pause()
		}
	}
	updateCurrentTime() {
		document.getElementById('CurrentTime')!.textContent = this.formatTime(this.getCurrentTime())
	}
}



class Terminal {
	private dom:HTMLTextAreaElement

	constructor(arg:{path:string,targ:string}) {
		this.dom = document.getElementById(arg.path) as HTMLTextAreaElement

		// this.dom.value = fs.readFileSync(arg.path,'utf8')

		// document.getElementById('Prev10')!.addEventListener('click',_$=>app.video.seek(-10))
		// document.getElementById('StartPause')!.addEventListener('click',app.video.pp)
		// document.getElementById('Fwd10')!.addEventListener('click',_$=>app.video.seek(10))
		// document.getElementById('PutBegin')!.addEventListener('click',this.putBegin)
		// document.getElementById('PutEnd')!.addEventListener('click',this.putEnd)

	}
	putBegin() {
		this.dom.value += `${app.video.formatTime(app.video.getCurrentTime(-0.01), true)} --> `
	}
	putEnd() {
		this.dom.value += `${app.video.formatTime(app.video.getCurrentTime(), true)}\nLoem ipsum ${Math.floor(Math.random()*100000)}\n\n`
	}
	resize() {
		let d = document.getElementById('VttEditorFrame')!
		let r = d.getBoundingClientRect()
		d.setAttribute('height', (window.innerHeight - 30 - r.top) + 'px')
	}
}



class Application {
	private videoPath :string
	private subtlPath :string
	private videoTarg :string = 'Video'
	private termTarg  :string = 'VttEditor'
	public video :Video
	private terminal :Terminal

	constructor(_arg:any) {
		this.video = new Video({path:this.videoPath, targ:this.videoTarg})
		this.terminal = new Terminal({path:this.subtlPath, targ:this.termTarg})
		document.addEventListener('keydown', this.keyEvents)
		window.addEventListener('resize', this.terminal.resize)
		document.getElementById('Write')!.addEventListener('click',this.writeFile)
	}
	static isExistFile(file:string) {
		try {
			fs.statSync(file)
			return true
		} catch(err) {
			if(err.code !== 'ENOENT') console.error(err)
			return false
		}
	}
	private keyEvents(e:KeyboardEvent) {
		if(/(textarea|input)/i.test(e.srcElement!.tagName)) return
		switch (e.key.toLowerCase()) {
			case 'q':
				this.video.seek(-10)
				break
			case 'e':
				this.video.seek(10)
				break
			case ' ':
				this.video.pp()
				break
			case 'i':
				this.terminal.putBegin()
				break
			case 'o':
				this.terminal.putEnd()
				break
		}
	}
	private writeFile() {
		let data = (document.getElementById('VttTerm')! as HTMLTextAreaElement).value
		fs.writeFile(this.subtlPath, data, (err:any)=>{
			if(err) throw err
		})
	}
	viewOpenFile() {

	}
}

class ApplicationRoute {
	private _pageId:string
	constructor(){
		this.pageId = window.location.hash || ''
	}
	set pageId(str:string){
		this._pageId = str
	}
	flow() {

	}
	changeHash(hash:string) {
		event!.preventDefault()
		window.location.assign('#'+hash)
	}
	isDisped(el:string, isDisp:boolean) {
		document.getElementById(el)!.style.display = (isDisp)? 'block': 'none'
	}
	linkDummy() {
		event!.preventDefault()
		this.isDisped('dummylink', true)
	}
	reload() {
		window.location.reload()
	}
	start() {
		window.addEventListener('hashchange', this.flow)
	}
}

/**
 * Run
 */
let Init = ()=>{
	appRoute = new ApplicationRoute()
	app      = new Application({})
	appRoute.start()
}
if(document.readyState!=='loading'){
	Init()
}else{
	document.addEventListener('DOMContentLoaded',Init)
}
