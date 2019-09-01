import {Divider, Grid, Image, Segment} from "semantic-ui-react";
import config from "./config";
import React from "react";

export default ({t}) => (
    <Segment inverted centered="true" vertical>
        <Divider horizontal inverted>
            ~ {t('title')} ~
        </Divider>
        <Grid columns={3} divided centered>
            <Grid.Row centered className="center">
                <Grid.Column textAlign="left">
                    <div style={{paddingLeft: "2em"}}>
                        <Image size="mini" src="/static/img/icon.svg" floated={"left"}/>
                        <a href="https://richcat.app" target="_blank">{t("richcat")}</a>
                    </div>
                </Grid.Column>
                <Grid.Column textAlign="center">© 2019 {t('title')} - {config.version()}</Grid.Column>
                <Grid.Column textAlign="right" style={{paddingRight: "2em"}}>
                    <a href="javascript:window.scrollTo(0, 0);">↑{t("go-to-top")}</a>
                    <a href="https://github/coolcode/dfile" target="_blank">
                        <img src="/static/img/github.svg" className="ui mini spaced image" title="GitHub"/>
                    </a>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Segment>
);
