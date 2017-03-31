import * as fs from 'fs'
import * as path from 'path'
const filePath = path.join(__dirname, 'subtitle.ja.vtt')

let app      :Application
let appRoute :ApplicationRoute



class VideoController {
	private video :HTMLVideoElement
	constructor(_arg:{path:string,el:string}) {
		this.video = document.getElementById('Video')! as HTMLVideoElement
		this.video.addEventListener('timeupdate', _=>this.updateCurrentTime())
		this.video.addEventListener('loadedmetadata', _=>this.initTimeCounter())
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
	initTimeCounter() {
		const el1 = 'CurrentTime'
		const el2 = 'TotalTime'
		document.getElementById(el1)!.textContent = this.formatTime(0)
		document.getElementById(el2)!.textContent = this.formatTime(this.video.duration)
	}
	updateCurrentTime() {
		document.getElementById('CurrentTime')!.textContent = this.formatTime(this.getCurrentTime())
	}
}



class Console {
	private dom :HTMLTextAreaElement

	constructor(_arg:{path:string,el:string}) {
		this.dom = document.getElementById('Textarea') as HTMLTextAreaElement

		fs.readFile(filePath,'utf8',(e,data)=>{
			if(e) {
				throw e
			}else{
				this.dom.value = data
			}
		})

		document.querySelector('#CheckNow button')!.addEventListener('click',_=>this.wtiin())
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
		d.setAttribute('height', (window.innerHeight - 16 - r.top) + 'px')
	}
	/**
	 * What time is it now?
	 */
	wtiin() {
		(document.querySelector('#CheckNow input') as HTMLInputElement)!.value = app.video.formatTime(app.video.getCurrentTime(), true)
	}
}



class FileController {
	private video :string
	private subtitle :string
	constructor(args:{vid:string,sub:string}) {
		this.video = args.vid
		this.subtitle = args.sub
		console.dir(this.showPath)
	}
	get showPath() {
		return [this.video, this.subtitle]
	}
}



class Application {
	private videoPath   :string
	private subtlPath   :string
	private videoElem   :string = 'Video'
	private consoleElem :string = 'Textarea'
	public video    :VideoController
	public console :Console

	constructor(_arg:any) {
		this.video = new VideoController({path:this.videoPath, el:this.videoElem})
		this.console = new Console({path:this.subtlPath, el:this.consoleElem})
		// this.video = new VideoController({path:this.videoPath, targ:this.videoElem})
		// this.console = new Console({path:this.subtlPath, targ:this.consoleElem})
		this.console.resize()
		document.addEventListener('keydown', e=>this.keyEvents(e))
		window.addEventListener('resize', _=>this.console.resize())
		document.getElementById('Write')!.addEventListener('click',_=>this.writeFile())
		document.getElementById('WriteReload')!.addEventListener('click',_=>this.writeFile(true))
	}
	private keyEvents(e:KeyboardEvent) {
		if(/(textarea|input)/i.test(e.srcElement!.tagName)) return
		switch (e.key.toLowerCase()) {
			case 'z':
			case 'arrowleft':
				this.video.seek(-10)
				break
			case 'x':
			case 'arrowright':
				this.video.seek(10)
				break
			case 'a':
				this.video.seek(-60)
				break
			case 's':
				this.video.seek(60)
				break
			case ' ':
				this.video.pp()
				break
			case 'i':
				this.console.putBegin()
				break
			case 'o':
				this.console.putEnd()
				break
			case 'c':
				this.console.wtiin()
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
	private pageId:string
	private events :any
	constructor(preset?:string){
		this.pageId = preset || window.location.hash || ''
		this.events = {
			"" : "",
			"open" : "openFile",
			"edit" : "edit",
			"lint" : "lint"
		}
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
