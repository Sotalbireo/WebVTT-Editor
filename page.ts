import * as fs from 'fs'
import * as path from 'path'
const filePath = path.join(__dirname, 'subtitle.ja.vtt')
let video :HTMLVideoElement



const formatTime = (t:number, f=false)=>{
	let h  = ('0' + Math.floor(t/3600)%60).slice(-2)
	let m  = ('0' + Math.floor(t/60)%60).slice(-2)
	let s  = ('0' + Math.floor(t)%60).slice(-2)
	return (f)? `${h}:${m}:${s}.${(Math.floor(t*100%6000) + '0').slice(-3)}`: `${h}:${m}:${s}`
}
let getCurrentTime = (indent=0)=>{
	return video.currentTime + indent
}
let setCurrentTime = ()=>{
	document.getElementById('CurrentTime')!.textContent = formatTime(getCurrentTime())
}
let setTotalTime = ()=>{
	video.addEventListener("loadedmetadata", function() {
		document.getElementById('TotalTime')!.textContent = formatTime(video.duration)
	}, false);
}

let startPause = ()=>{
	if(video.paused || video.ended){
		video.play()
	}else{
		video.pause()
	}
}

let appendBegin = ()=>{
	let dom = document.getElementsByTagName('textarea')[0]
	dom.value += `${formatTime(getCurrentTime(), true)} --> `
}
let appendEnd = ()=>{
	let dom = document.getElementsByTagName('textarea')[0]
	dom.value += `${formatTime(getCurrentTime(), true)}
Loem ipsum ${Math.floor(Math.random()*100000)}\n\n`
}

let keyboardEvents = (e:KeyboardEvent)=>{
	if(/textarea/i.test(e.srcElement!.tagName)) return

	switch (e.key.toLowerCase()) {
		case 'q':
			appendBegin()
			break;
		case 'e':
			appendEnd()
			break;
	}
}



let overwriteFile = ()=>{
	if(confirm('Overwrite, right?\nIf Ok then this Page will Reload.')){
		let data = document.getElementsByTagName('textarea')[0].value
		fs.writeFile(filePath, data, (err:any)=>{
			if(err){ throw err
			}else{ location.reload(true)
			}
		})
	}
}

const textareaResize = ()=>{
	let d = document.getElementById('Textarea')!
	const h = window.innerHeight
	const rect = d.getBoundingClientRect()
	d.setAttribute('height', (h - 30 - rect.top) + 'px')
}



/**
 * INITS
 */
let preInit = ()=>{
	if(!isExistFile(filePath)){
		const data = fs.readFileSync(path.join(__dirname, 'assets', 'sample.vtt.txt'), 'utf8')
		fs.writeFile(filePath, data, (err:any)=>{
			if(err){ throw err
			}else{
				location.reload(true)
			}

		})
	}
}

let Init = ()=>{

	video = document.getElementsByTagName('video')[0]
	textareaResize()
	setTotalTime()

	document.getElementById('StartPause')!.addEventListener('click',startPause,false)
	document.getElementById('Prev10')!.addEventListener('click',(()=>{video.currentTime -= 10}),false)
	document.getElementById('Fwd10')!.addEventListener('click',(()=>{video.currentTime += 10}),false)
	document.getElementById('Overwrite')!.addEventListener('click',overwriteFile,false)
	document.getElementById('AppendBegin')!.addEventListener('click',appendBegin,false)
	document.getElementById('AppendEnd')!.addEventListener('click',appendEnd,false)
	document.addEventListener('keypress', keyboardEvents, false)
	document.getElementsByTagName('textarea')[0].removeEventListener('keypress', keyboardEvents, false)

	document.getElementsByTagName('textarea')[0].value = fs.readFileSync(filePath,'utf8')

	video.addEventListener('timeupdate', setCurrentTime, false)
	window.addEventListener('resize', textareaResize, false)
}





/**
 * Run
 */
let ready = (fn:any)=>{
	if(document.readyState!=='loading'){
		fn()
	}else{
		document.addEventListener('DOMContentLoaded',fn)
	}
}
preInit()
ready(Init)




/**
 * Utilities
 */
function isExistFile(file:string){
	try {
		fs.statSync(file)
		return true
	} catch(err) {
		if(err.code === 'ENOENT'){
			return false
		}else{
			console.error(err)
			return false
		}
	}

}
