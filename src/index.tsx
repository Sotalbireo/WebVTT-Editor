import * as React from 'react'
import { render } from 'react-dom'
// import { Button, Container, Header } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Video from 'components/Video'

const MOUNT_NODE = document.getElementById('root')

class Application extends React.Component<any, any> {

	constructor(props:any) {
		super(props);
	}
	render() {
		return (
			<table className='fullWH'>
				<colgroup>
					<col style={{width:"50%"}} />
				</colgroup>
				<tbody>
					<tr>
						<td id='Video'>
							<Video url='./data/video.mp4' />
						</td>
						<td id='box'></td>
					</tr>
					<tr>
						<td id='Consoles'>{this.props.txt}</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

render(<Application txt='text'/>, MOUNT_NODE)
