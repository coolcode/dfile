import {Divider, Grid, Image, Segment} from "semantic-ui-react";
import config from "./config";
import React from "react";

export default ({t}) => (
    <Segment inverted centered="true" vertical>
        {/* <Divider horizontal inverted>
             {t('host')}&nbsp;@&nbsp;
            <a href="https://m.do.co/c/0f9c9b9aace1" target="_blank"><img className="digitalocean" src="/static/img/digitalocean.svg"/></a>
        </Divider> */}
        <Grid columns={3} divided centered>
            <Grid.Row centered className="center">
                <Grid.Column textAlign="left">
                    <div style={{paddingLeft: "2em"}}>
                        <a href="https://nee.how" target="_blank"><Image size="tiny" src="/static/img/banner-neehow.svg" floated={"left"}/>
                        {t("neehow")}</a>
                    </div>
                </Grid.Column>
                <Grid.Column textAlign="center">© 2019-{new Date().getFullYear()} {t('title')} - {config.version()} </Grid.Column>
                <Grid.Column textAlign="right" style={{paddingRight: "2em"}}>
                    <a href="javascript:window.scrollTo(0, 0);">↑{t("go-to-top")}</a>
                    <a href="https://github.com/coolcode/dfile" target="_blank">
                        <img src="/static/img/github.svg" className="ui mini spaced image" title="GitHub"/>
                    </a>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Segment>
);
