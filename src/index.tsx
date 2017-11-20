import * as React from 'react'
import { render } from 'react-dom'
// import { Button, Container, Header } from 'semantic-ui-react'
import { Container, Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import Video from './components/Video'
import Subtitle from './components/Subtitle'

const MOUNT_NODE = document.getElementById('root')

class Application extends React.Component<any, any> {
	videoPath = './data/video.mp4'
	subtlPath = './data/subtitle.vtt'

	constructor(props:any) {
		super(props)
	}
	render() {
		return (
			<Container
				className='h-100'
				fluid
			>
				<Grid
					className='h-100'
					columns={2}
				>
					<Grid.Row style={{paddingBottom:0}}>
						<Grid.Column>
							<Grid divided='vertically'>
								<Grid.Row columns={1}>
									<Grid.Column id='Video'>
										<Video url={this.videoPath} src={this.subtlPath} />
									</Grid.Column>
									<Grid.Column id='Console' style={{backgroundColor:"#ccf"}}>
										<p>hogefuga</p>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Grid.Column>
						<Grid.Column id='Box' style={{backgroundColor:"#fcc"}}>
							<Subtitle url={this.subtlPath} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		)
	}
}

render(<Application txt='text'/>, MOUNT_NODE)
