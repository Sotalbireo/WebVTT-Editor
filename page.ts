import * as fs from 'fs'
import * as path from 'path'
const filePath = path.join(__dirname, 'subtitle.ja.vtt')

let app      :Application
let appRoute :ApplicationRoute


class VideoController {
	private video :HTMLVideoElement
	constructor(_arg:{path:string,targ:string}) {
		this.video = document.getElementById('Video')! as HTMLVideoElement
		this.video.addEventListener('timeupdate', _=>this.updateCurrentTime())
		this.video.addEventListener('loadedmetadata', _=>this.setTotalTime())
	}
	formatTime(t:number, f=false) {
		let h   = ('0'  + Math.floor(t/3600)%60).slice(-2)
		let m   = ('0'  + Math.floor(t/60  )%60).slice(-2)
		let s   = ('0'  + Math.floor(t     )%60).slice(-2)
		let sss = ('00' + Math.floor(t%10*1000)).slice(-3)
		return (f)? `${h}:${m}:${s}.${sss}`: `${h}:${m}:${s}`
	}
	getCurrentTime(indent=0) {
		return this.video.currentTime + indent
	}
	pp() {
		if(this.video.paused || this.video.ended){
			this.video.play()
		}else{
			this.video.pause()
		}
	}
	reloadResource() {
		this.video.load()
	}
	seek(s:number) {
		this.video.currentTime += s
	}
	setTotalTime() {
		const el = 'TotalTime'
		document.getElementById(el)!.textContent = this.formatTime(this.video.duration)
	}
	updateCurrentTime() {
		document.getElementById('CurrentTime')!.textContent = this.formatTime(this.getCurrentTime())
	}
}



class Terminal {
	private dom :HTMLTextAreaElement

	constructor(_arg:{path:string,targ:string}) {
		this.dom = document.getElementById('Textarea') as HTMLTextAreaElement

		this.dom.value = fs.readFileSync(filePath,'utf8')

		document.getElementById('Prev10')!.addEventListener('click',_=>app.video.seek(-10))
		document.getElementById('PlayPause')!.addEventListener('click',_=>app.video.pp())
		document.getElementById('Fwd10')!.addEventListener('click',_=>app.video.seek(10))
		document.getElementById('PutBegin')!.addEventListener('click',_=>this.putBegin())
		document.getElementById('PutEnd')!.addEventListener('click',_=>this.putEnd())

	}
	putBegin(indent=-0.05) {
		this.dom.value += `${app.video.formatTime(app.video.getCurrentTime(indent), true)} --> `
	}
	putEnd() {
		this.dom.value += `${app.video.formatTime(app.video.getCurrentTime(), true)}\nLoemIpsum${Math.floor(Math.random()*100000)}\n\n`
	}
	resize() {
		let d = document.getElementById('TextareaFrame')!
		let r = d.getBoundingClientRect()
		d.setAttribute('height', (window.innerHeight - 30 - r.top) + 'px')
	}
}



// class OpenFile {
// 	private video :string
// 	private subtitle :string
// 	constructor(args:{vid:string,sub:string}) {
// 		this.video = args.vid
// 		this.subtitle = args.sub
// 		console.dir(this.showPath)
// 	}
// 	get showPath() {
// 		return [this.video, this.subtitle]
// 	}
// }



class Application {
	private videoPath :string
	private subtlPath :string
	private videoTarg :string = 'Video'
	private termTarg  :string = 'VttEditor'
	public video    :VideoController
	public terminal :Terminal

	constructor(_arg:any) {
		this.video = new VideoController({path:this.videoPath, targ:this.videoTarg})
		this.terminal = new Terminal({path:this.subtlPath, targ:this.termTarg})
		// this.video = new VideoController({path:this.videoPath, targ:this.videoTarg})
		// this.terminal = new Terminal({path:this.subtlPath, targ:this.termTarg})
		this.terminal.resize()
		document.addEventListener('keydown', e=>this.keyEvents(e))
		window.addEventListener('resize', _=>this.terminal.resize())
		document.getElementById('Write')!.addEventListener('click',_=>this.writeFile())
		document.getElementById('WriteReload')!.addEventListener('click',_=>this.writeFile(true))
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
			case 'arrowleft':
				this.video.seek(-10)
				break
			case 'e':
			case 'arrowright':
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
	private writeFile(flag=false) {
		let data = (document.getElementById('Textarea')! as HTMLTextAreaElement).value
		fs.writeFile(filePath, data, (err:any)=>{
			if(err) throw err
			if(flag) appRoute.reload()
			// this.video.reloadResource()
		})
	}
	viewOpenFile() {

	}
}

class ApplicationRoute {
	private _pageId:string
	constructor(preset?:string){
		this.pageId = preset || window.location.hash || ''
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
	isDisp(el:string, isDisp:boolean) {
		document.getElementById(el)!.style.display = (isDisp)? 'block': 'none'
	}
	linkDummy() {
		event!.preventDefault()
		this.isDisp('dummylink', true)
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
