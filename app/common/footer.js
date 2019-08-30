import { Divider, Grid, Image, Segment } from "semantic-ui-react";
import config from "./config";
import React from "react";

export default ({t}) => (
	<Segment inverted centered="true" vertical>
		<Divider horizontal inverted>
			~ Dfile ~
		</Divider>
		<Grid columns={3} divided centered>
			<Grid.Row centered className="center">
				<Grid.Column textAlign="left">
					<div style={{ paddingLeft: "2em" }}>
						<Image size="mini" src="/static/img/icon.svg" floated={"left"}/>
                        <a href="https://richcat.app" target="_blank">{t("richcat")}</a>
					</div>
				</Grid.Column>
				<Grid.Column textAlign="center">© 2019 Dfile - {config.version()}</Grid.Column>
				<Grid.Column textAlign="right" style={{ paddingRight: "2em" }}>
					<a href="javascript:window.scrollTo(0, 0);">↑{t("go-to-top")}</a>
					<a href="https://github/coolcode/dfile" target="_blank">
                    <img src="/static/img/github.svg" className="ui mini spaced image" title="GitHub"/>
                    </a>
					{/*<a href="https://t.me/dfilegame" target="_blank">*/}
                        {/*<img src="/static/img/telegram.svg" className="ui mini spaced image"/>*/}
					{/*</a>*/}
					{/*<a href="https://discord.io/dfile" target="_blank">*/}
                        {/*<img src="/static/img/discord.svg" className="ui mini spaced image"/>*/}
					{/*</a>*/}
                    {/*<a href="https://twitter.com/dfile20234190" target="_blank">*/}
                        {/*<img src="/static/img/twitter.svg" className="ui mini spaced image"/>*/}
                    {/*</a>*/}
                    {/*<a href="https://www.facebook.com/dfileapp" target="_blank">*/}
                        {/*<img src="/static/img/facebook.svg" className="ui mini spaced image"/>*/}
                    {/*</a>*/}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	</Segment>
);
