import * as fs from 'fs'
import * as path from 'path'
import MargeViT from '../module/MargeTiV'
const { ipcRenderer } = require('electron')
// const remote = require('electron').remote
const subtitlePath = path.resolve(path.join(__dirname, '../data/subtitle.vtt'))
// const notePath = path.join(__dirname, 'note.txt')
// import { VttParser } from './src/module/VttParser'

let emmy :Emmy



class VideoController {
	private video :HTMLVideoElement
	// private duration :number
	constructor(_arg:{path:string,el:string}) {
		this.video = document.getElementById('Video')! as HTMLVideoElement
		this.video.addEventListener('timeupdate', _=>this.updateCurrentTime())
		this.video.addEventListener('loadedmetadata', _=>this.init())
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
	seek_f(f:number) {
		this.video.pause()
		this.video.currentTime += f*0.166 // ~1/60
	}
	init() {
		const el1 = 'CurrentTime'
		const el2 = 'TotalTime'
		document.getElementById(el1)!.textContent = this.formatTime(this.video.currentTime)
		document.getElementById(el2)!.textContent = this.formatTime(this.video.duration)
	}
	updateCurrentTime() {
		document.getElementById('CurrentTime')!.textContent = this.formatTime(this.getCurrentTime())
	}
}



class Consoles {
	private dom :HTMLTextAreaElement
	private latestNote :string = ''
	private mikoto = 0
	get misaka() {
		this.mikoto++
		return ('00000'+this.mikoto).substr(-6)
	}

	constructor(_arg:{path:string,el:string}) {
		this.dom = document.getElementById('Textarea') as HTMLTextAreaElement

		this.mikoto = Math.floor(Math.random()*100000)

		fs.readFile(subtitlePath,'utf8',(e,data:any)=>{
			if(e) {
				throw e
			}else{
				this.dom.value = data
			}
		})

		document.querySelector('#CheckNow button')!.addEventListener('click',_=>this.wtiin())
		document.getElementById('Prev10')!.addEventListener('click',_=>emmy.video.seek(-10))
		document.getElementById('PlayPause')!.addEventListener('click',_=>emmy.video.pp())
		document.getElementById('Fwd10')!.addEventListener('click',_=>emmy.video.seek(10))
		document.getElementById('PutBegin')!.addEventListener('click',_=>this.putBegin())
		document.getElementById('PutEnd')!.addEventListener('click',_=>this.putEnd())

	}
	putBegin(indent = -0.05) {
		this.latestNote = `${emmy.video.formatTime(emmy.video.getCurrentTime(indent), true)} --> `
		this.dom.value += this.latestNote
	}
	putDiv() {
		this.latestNote = `${emmy.video.formatTime(emmy.video.getCurrentTime(), true)}\n${this.misaka}\n\n${emmy.video.formatTime(emmy.video.getCurrentTime(), true)} --> `
		this.dom.value += this.latestNote
	}
	putEnd() {
		this.latestNote = `${emmy.video.formatTime(emmy.video.getCurrentTime(), true)}\n${this.misaka}\n\n`
		this.dom.value += this.latestNote
	}
	resize() {
		let d = document.getElementById('TextareaFrame')!
		let r = d.getBoundingClientRect()
		d.setAttribute('height', (window.innerHeight - 12 - r.top) + 'px')
	}
	/**
	 * What time is it now?
	 */
	wtiin() {
		(document.querySelector('#CheckNow input') as HTMLInputElement)!.value = emmy.video.formatTime(emmy.video.getCurrentTime(), true)
	}
	deleteLatestNote() {
		if (this.latestNote.length === 0) return
		this.dom.value = this.dom.value.slice(0, (-1 * this.latestNote.length))
		this.latestNote = ''
	}

}



class Emmy {
	private videoPath   :string
	private subtlPath   :string
	private videoElem   :string = 'Video'
	private consoleElem :string = 'Textarea'
	public video   :VideoController
	public console :Consoles

	constructor(_arg:any) {
		window.addEventListener('error', (e:ErrorEvent)=>Emmy.popinAlert({head:e.type.charAt(0).toUpperCase() + e.type.slice(1), str:e.message}))
		this.video = new VideoController({path:this.videoPath, el:this.videoElem})
		this.console = new Consoles({path:this.subtlPath, el:this.consoleElem})
		document.addEventListener('keydown', e=>this.keyEvents(e))
		window.addEventListener('resize', _=>this.console.resize())
		document.getElementById('Write')!.addEventListener('click',_=>this.writeFile())
		document.getElementById('WriteReload')!.addEventListener('click',_=>this.writeFile(true))
		this.console.resize()

		this.setIPC()
	}

	private keyEvents(e:KeyboardEvent) {
		if(/(textarea|input)/i.test(e.srcElement!.tagName)) return
		switch (e.key.toLowerCase()) {
			case 'v':
			case 'arrowleft':
				this.video.seek(-10)
				break
			case 'n':
			case 'arrowright':
				this.video.seek(10)
				break
			case 'c':
				if(e.shiftKey) {
					this.video.seek(-600)
				} else {
					this.video.seek(-60)
				}
				break
			case 'm':
				if(e.shiftKey) {
					this.video.seek(600)
				} else {
					this.video.seek(60)
				}
				break
			case ' ':
				this.video.pp()
				break
			case 'b':
				if(e.shiftKey) {
					this.video.seek_f(-1)
				} else {
					this.video.seek_f(1)
				}
				break
			case 'i':
				this.console.putBegin()
				break
			case 'o':
				this.console.putDiv()
				break
			case 'p':
				this.console.putEnd()
				break
			case 'c':
				this.console.wtiin()
				break
			case 's':
				if(e.ctrlKey) this.writeFile()
				break
			case '\\':
				this.console.deleteLatestNote()
				break
		}
	}

	private writeFile(flag=false) {
		let data = (document.getElementById('Textarea')! as HTMLTextAreaElement).value
		fs.writeFile(subtitlePath, data, (err:any)=>{
			if(err) throw err
			if(flag) window.location.reload()
		})
	}



	private MergeTXTintoVTT(args:any) {
		const marge = new MargeViT()
		marge.exe(args)
	}



	private setIPC() {
		ipcRenderer.on('Open-subtitle-file', (_:Event, res:string)=>{
			console.log(res)
		})
		ipcRenderer.on('Verify-for-Now-used-file', ()=>{
			console.log(subtitlePath)
			// let vttParser = new VttParser()
			// vttParser.test(subtitlePath)
		})
		ipcRenderer.on('Verify-for-Open-file', (_:Event, res:string)=>{
			console.log(res)
		})
		ipcRenderer.on('Merge-text-into-Vtt', (_:Event, _res:any)=>{
			this.MergeTXTintoVTT({
				txtPath: path.resolve(path.join(__dirname, '../data/noteTest.txt')),
				vttPath: path.resolve(path.join(__dirname, '../data/subtitleTest.vtt'))
			})
		})
	}



	static popinAlert(attr?: {type?:string, head?:string, str?:any}) {
		attr = attr || {}
		attr.type = attr.type || 'danger'
		attr.head = attr.head || 'Oops!'
		attr.str  = attr.str  || 'General error.'
		const alert=`
<div class="alert alert-${attr.type}" role="alert">
  <h4 class="alert-heading">${attr.head} <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick="javascript:this.parentNode.parentNode.outerHTML='';"><span aria-hidden="true">&times;</span></button></h4>
  <p class="mb-0">${attr.str}</p>
</div>`
		document.getElementById('Body')!.insertAdjacentHTML('beforebegin', alert);
	}
}





/**
 * Run
 */
const Init = ()=>{
	emmy = new Emmy({})
}
if(document.readyState!=='loading'){
	Init()
}else{
	document.addEventListener('DOMContentLoaded',Init)
}
