import React, {Component} from "react"
import {Segment, Grid, Button, Card, Image, Form, Label, Icon} from 'semantic-ui-react';
import {i18n, Link, withNamespaces} from '../i18n'
import Layout from "./layout"
import axios from 'axios';

class _index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            files: []
        };

        this.onChange = this.onChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }

    static async getInitialProps() {
        return {
            namespacesRequired: ['common'],
        }
    }


    onChange(event) {
        this.setState({
            files: event.target.files,
            loading: false,
        });

        if(event.target.files.length>0){
            console.log("file: ", event.target.files[0]);
            this.upload(event.target.files);
        }
    }

    upload(files) {
        let file_url = "http://localhost:4562";
        for(let i=0;i<files.length;i++){
            const data = new FormData();
            data.append('file', files[i]);
            axios.post(file_url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log('res: ', res)
            })
        }
    }

    onUpload(event){
        this.file_input.click();
    }

    render() {
        const {t} = this.props;
        //return <h1> Hello World</h1>;
        return (
            <Layout {...this.props}>

                <Segment id="game" style={{padding: "0em 0em"}} vertical>
                    <Grid centered>

                        <Grid.Column textAlign="center">
                            <h1 className="title">{t("title")}</h1>
                            <div className="term">
                                <div className="term-header">
                                    <button className="term-header-button term-header-button-close"></button>
                                    <button className="term-header-button term-header-button-minimize"></button>
                                    <button className="term-header-button term-header-button-expand"></button>
                                    <div className="term-header-title">
                                        <span>&#11014; Dfile@bruce-macbook-pro: ~ (dfile)</span>
                                    </div>
                                </div>
                                <div className="term-content">
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># Upload using cURL</span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-caret">curl -F file=@yourfile.txt https://dfile.app</span>
                                        <p className="term-content-output">https://dfile.app/QmV...HZ</p>
                                    </div>
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># Upload using <a href='https://github.com/coolcode/dfile/wiki/Alias-or-Commands' target="_blank">'dfile'</a> alias,
                                            <a href='https://github.com/coolcode/dfile/wiki/Alias-or-Commands' target="_blank">{t("learn-more")}</a>
                                        </span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-caret">dfile yourfile.txt</span>
                                        <p className="term-content-output">https://dfile.app/QmV...HZ</p>

                                    </div>
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># Upload from web</span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-ouput">Drag your files here, or <a className="browse" href="javascript:void(0);" onClick={this.onUpload}> click to browse.</a> </span>
                                        <input ref={input => this.file_input = input} type="file" name="file" multiple="multiple" style={{display: "none"}} onChange={this.onChange} />
                                        <p className="term-content-output"></p>
                                    </div>
                                </div>
                            </div>
                            <p>
                                <br/>
                                <Button size="huge" color="blue" inverted onClick={this.onUpload}> {t("upload-file")}  </Button>
                            </p>
                            <br/>
                        </Grid.Column>

                    </Grid>
                </Segment>

                <Segment id="feature" style={{margin: "1em 0em"}} vertical>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <h1 className="title">{t("feature")}</h1>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <Card.Group stackable>
                                    <Card style={{"maxWidth": "180px"}}>
                                        <Card.Content>
                                            <Image src='/static/img/free.svg' size="small"/>
                                            <Card.Header textAlign="center">Free use</Card.Header>
                                        </Card.Content>
                                    </Card>
                                    <Card style={{"maxWidth": "180px"}}>
                                        <Card.Content>
                                            <Image src='/static/img/cloud.svg' size="small"/>
                                            <Card.Header textAlign="center">IPFS</Card.Header>
                                        </Card.Content>
                                    </Card>
                                    <Card style={{"maxWidth": "180px"}}>
                                        <Card.Content>
                                            <Image src='/static/img/clock.svg' size="small"/>
                                            <Card.Header textAlign="center">Files stored forever</Card.Header>
                                        </Card.Content>
                                    </Card>
                                    <Card style={{"maxWidth": "180px"}}>
                                        <Card.Content>
                                            <Image src='/static/img/database.svg' size="small"/>
                                            <Card.Header textAlign="center">Unlimited storage</Card.Header>
                                        </Card.Content>
                                    </Card>
                                    <Card style={{"maxWidth": "180px"}}>
                                        <Card.Content>
                                            <Image src='/static/img/terminal.svg' size="small"/>
                                            <Card.Header textAlign="center">Shell upload</Card.Header>
                                        </Card.Content>
                                    </Card>
                                    <Card style={{"maxWidth": "180px"}}>
                                        <Card.Content>
                                            <Image src='/static/img/link.svg' size="small"/>
                                            <Card.Header textAlign="center">Share files with a URL</Card.Header>
                                        </Card.Content>
                                    </Card>
                                    <Card style={{"maxWidth": "180px"}}>
                                        <Card.Content>
                                            <Image src='/static/img/blockchain.svg' size="small"/>
                                            <Card.Header textAlign="center">{t("blockchain-tech")}</Card.Header>
                                        </Card.Content>
                                    </Card>
                                </Card.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment id="github" style={{margin: "1em 0em"}} vertical>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <h1 className="title">{t("follow-github")}</h1>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <iframe src="https://ghbtns.com/github-btn.html?user=coolcode&repo=dfile&type=follow&count=true&size=large" allowTransparency="true" frameBorder="0" scrolling="0"
                                        width="250"
                                        height="50"></iframe>
                                <iframe src="https://ghbtns.com/github-btn.html?user=coolcode&repo=dfile&type=watch&count=true&size=large" allowTransparency="true" frameBorder="0" scrolling="0"
                                        width="200"
                                        height="50"></iframe>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment id="contact" style={{margin: "1em 0em"}} vertical>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <h1 className="title">{t("contact")}</h1>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <div id="contact-form">
                                    <Form method="POST" action="https://formspree.io/bruce.meerkat@gmail.com">
                                        <Form.Field inline>
                                            <label>Your email:</label>
                                            <div className="ui small input">
                                                <input type="email" id="email1" name="_replyto" aria-describedby="emailHelp" placeholder="Your email" required style={{width: "200px"}}/>
                                            </div>
                                            &nbsp;
                                            <Label pointing='left'>We'll never store or share your email. </Label>

                                        </Form.Field>
                                        <Form.Field inline>
                                            <div className="ui small input">
                                                <textarea type="password" className="form-control" id="message" name="message" placeholder="Your message" required style={{width: "80vw"}}></textarea>
                                            </div>
                                        </Form.Field>
                                        <Form.Field inline>
                                            <Button
                                                size="huge"
                                                color="blue"
                                                type="submit"
                                                inverted
                                            >
                                                {t("send")}
                                            </Button>
                                        </Form.Field>
                                    </Form>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment id="donate" style={{margin: "1em 0em"}} vertical>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <h1 className="title">{t("donate")}</h1>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <p>
                                    ETH: 0x56C4ECf7fBB1B828319d8ba6033f8F3836772FA9
                                </p>
                                <p>
                                    BitCoin: bc1qzqkpmpv6kp5a48yc4rcn9gudvjgad6hq9zvk8k
                                </p>
                                <p>
                                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4CL7P88WYLH5J&item_name=To+make+the+service+and+the+world+better%21&currency_code=AUD&source=url"
                                       target="_blank"><img src="https://www.paypalobjects.com/webstatic/logo/logo_paypal_106x27.png"/>&nbsp;Buy me a coffee</a>
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Layout>
        )
    }
}

export default withNamespaces('common')(_index)
