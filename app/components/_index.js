import React, {Component} from "react"
import {Segment, Grid, Button, Card, Image, Form, Label, Icon} from 'semantic-ui-react';
import {i18n, Link, withNamespaces} from '../i18n'
import Layout from "./layout"
import axios from 'axios';
import {Menu} from "semantic-ui-react/dist/commonjs/collections/Menu/Menu";

class _index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            files: []
        };

        this.onChange = this.onChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    static async getInitialProps() {
        return {
            namespacesRequired: ['common'],
        }
    }

    onChange(e) {
        if (e.target.files.length > 0) {
            console.log("file: ", e.target.files[0]);
            this.upload(e.target.files);
        }
    }

    upload(files) {
        for (let i = 0; i < files.length; i++) {
            this.upload_file(files[i]);
        }
    }

    upload_file(file) {
        const upload_file_url = (process.env.NODE_ENV == 'production' ? "https://dfile.app" : "http://localhost:5000");
        //const upload_file_url="https://dfile.app";
        const data = new FormData();
        data.append('file', file);
        const self = this;
        axios.post(upload_file_url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.log('res: ', res);
            const upload_result = {name: file.name, url: res.data}
            const list = self.state.files.concat(upload_result);
            self.setState({files: list});
        })
    }

    onUpload(e) {
        e.preventDefault()
        this.file_input.click();
    }

    onDrag(e) {
        e.preventDefault();
        if (!e.dataTransfer) {
            console.log('e: ', e);
            return;
        }
        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();
                    //console.log('... file[' + i + '].name = ' + file.name);
                    this.upload_file(file);
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                const file = e.dataTransfer.files[i];
                //console.log('... file[' + i + '].name = ' + file.name);
                this.upload_file(file);
            }
        }
    }

    onDragOver(e) {
        e.preventDefault();
        console.log('File(s) in drop zone');
    }

    onClear(e) {
        e.preventDefault();
        this.setState({files: []});
    }

    render() {
        const {t} = this.props;
        const features = [
            {img: '/static/img/free.svg', text: t('feature-free')},
            {img: '/static/img/cloud.svg', text: t('feature-ipfs')},
            {img: '/static/img/clock.svg', text: t('feature-time')},
            {img: '/static/img/database.svg', text: t('feature-storage')},
            {img: '/static/img/terminal.svg', text: t('feature-terminal')},
            {img: '/static/img/link.svg', text: t('feature-link')},
            {img: '/static/img/blockchain.svg', text: t('feature-blockchain')}
        ];

        return (
            <Layout {...this.props}>

                <Segment id="head" style={{padding: "0em 0em"}} vertical>
                    <Grid centered>

                        <Grid.Column textAlign="center">
                            <h1 className="title">{t("sub-title")}</h1>
                            <div className="term" onDrop={this.onDrag} onDragOver={this.onDragOver}>
                                <div className="term-header">
                                    <button className="term-header-button term-header-button-close"></button>
                                    <button className="term-header-button term-header-button-minimize"></button>
                                    <button className="term-header-button term-header-button-expand"></button>
                                    <div className="term-header-title">
                                        <span>&#11014; DFile@bruce-macbook-pro: ~ (dfile)</span>
                                    </div>
                                </div>
                                <div className="term-content">
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># {t('comment-curl')}</span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-caret">curl -F file=@yourfile.txt https://dfile.app</span>
                                        <p className="term-content-output">https://dfile.app/QmV...HZ</p>
                                    </div>
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># {t('comment-using')} <a href='https://github.com/coolcode/dfile/issues/1'
                                                                                                         target="_blank">'dfile'</a> {t('comment-alias')},&nbsp;
                                            <a href='https://github.com/coolcode/dfile/issues/1' target="_blank">{t("learn-more")}</a>
                                        </span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-caret">dfile yourfile.txt</span>
                                        <p className="term-content-output">https://dfile.app/QmV...HZ</p>
                                    </div>
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># {t('comment-web')}</span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-ouput">{t('comment-drag')}<a href='' className="browse" onClick={this.onUpload}>{t('comment-browse')}</a>
                                            {(this.state.files.length > 0) && (
                                                <a className="clear" href='' onClick={this.onClear}>&nbsp;{t('clear-file')} <img src='/static/img/close.svg' className="clear"/></a>)}
                                           </span>
                                        <input ref={input => this.file_input = input} type="file" name="file" multiple="multiple" style={{display: "none"}} onChange={this.onChange}/>
                                        <div className="term-content-output">
                                            {this.state.files.map(item => (
                                                <>{item.name}: <a href={item.url} target="_blank">{item.url}</a><br/></>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <br/>
                                <Button size="huge" color="blue" inverted onClick={this.onUpload}> {t("upload-file")}  </Button>
                            </div>
                            <br/>
                        </Grid.Column>

                    </Grid>
                </Segment>

                <Segment id="features" style={{margin: "1em 0em"}} vertical>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <h1 className="title">{t("features")}</h1>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <Card.Group stackable centered>
                                    {features.map((item, i) => (
                                        <div className="feature" key={i}>
                                            <Image src={item.img} size="small"/>
                                            <h1>{item.text}</h1>
                                        </div>
                                    ))}
                                </Card.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment id="docs" style={{margin: "1em 0em"}} vertical>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <h1 className="title">{t("docs")}</h1>
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>
                    <Grid columns={2} centered stackable>
                        <Grid.Column>
                            <div className="term-mini">
                                <div className="term-header">
                                    <button className="term-header-button term-header-button-close"></button>
                                    <button className="term-header-button term-header-button-minimize"></button>
                                    <button className="term-header-button term-header-button-expand"></button>
                                    <div className="term-header-title">
                                        <span>&#11014; DFile@bruce-macbook-pro: ~ (dfile)</span>
                                    </div>
                                </div>
                                <div className="term-content">
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># {t('comment-curl')}</span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-caret">curl -F file=@yourfile.txt https://dfile.app</span>
                                        <p className="term-content-output">https://dfile.app/QmV...HZ</p>
                                    </div>
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># {t('comment-download')}</span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-caret">curl https://dfile.app/QmV...HZ -o yourfile.txt</span>
                                        <p className="term-content-output"></p>
                                    </div>
                                    <div className="term-content-row">
                                    </div>
                                </div>
                            </div>

                        </Grid.Column>
                        <Grid.Column>
                            <div className="term-mini">
                                <div className="term-header">
                                    <button className="term-header-button term-header-button-close"></button>
                                    <button className="term-header-button term-header-button-minimize"></button>
                                    <button className="term-header-button term-header-button-expand"></button>
                                    <div className="term-header-title">
                                        <span>&#11014; DFile@bruce-macbook-pro: ~ (dfile)</span>
                                    </div>
                                </div>
                                <div className="term-content">
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># {t('comment-using')} <a href='https://github.com/coolcode/dfile/issues/1'
                                                                                                         target="_blank">'dfile'</a> {t('comment-alias')},&nbsp;
                                            <a href='https://github.com/coolcode/dfile/issues/1' target="_blank">{t("learn-more")}</a>
                                        </span><br/>
                                        <span className="term-content-comment"># {t('comment-add-alias')} </span><br/>

                                        <span className="term-content-caret"><code>
                                            {`dfile() { if [ $# -eq 0 ]; then echo -e "No arguments specified. Usage:\necho dfile /tmp/test.md\ncat /tmp/test.md | dfile test.md"; return 1; fi <br/>tmpfile=$(
                                            mktemp -t transferXXX ); if tty -s; then basefile=$(basename "$1" | sed -e 's/[^a-zA-Z0-9._-]/-/g'); curl --progress-bar -F file=@"$1" "https://dfile.app" >>
                                            $tmpfile; else curl --progress-bar -F file=@"-" "https://dfile.app/$1" >> $tmpfile ; fi; cat $tmpfile; rm -f $tmpfile; }`}
                                        </code></span>
                                        <p className="term-content-output"></p>
                                    </div>
                                    <div className="term-content-row">
                                        <span className="term-content-comment"># {t('comment-use-alias')}</span><br/>
                                        <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                        <span className="term-content-caret">dfile yourfile.txt</span>
                                        <p className="term-content-output">https://dfile.app/QmV...HZ</p>

                                    </div>
                                </div>
                            </div>

                        </Grid.Column>
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
                                <a className="github-button" href="https://github.com/coolcode" data-size="large" data-show-count="true" aria-label="Follow @coolcode on GitHub">Follow
                                    @coolcode</a>&nbsp;&nbsp;
                                <a className="github-button" href="https://github.com/coolcode/dfile" data-icon="octicon-star" data-size="large" data-show-count="true"
                                   aria-label="Star coolcode/dfile on GitHub">Star</a>
                                {/*<GitHubButton href="https://github.com/coolcode" data-size="large" data-show-count="true" aria-label="Follow @coolcode on GitHub">Follow @coolcode</GitHubButton>*/}
                                {/*<GitHubButton href="https://github.com/coolcode/dfile" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star coolcode/dfile on GitHub">Star</GitHubButton>*/}
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
                                            <label>{t("label-email")}:</label>
                                            <div className="ui small input" style={{margin: "5px"}}>
                                                <input type="email" name="_replyto" aria-describedby="emailHelp" placeholder={t("label-email")} required style={{width: "200px"}}/>
                                            </div>
                                            &nbsp;
                                            <Label pointing='left'>{t("tips-email")} </Label>

                                        </Form.Field>
                                        <Form.Field inline>
                                            <div className="ui small input">
                                                <textarea type="password" className="form-control" id="message" name="message" placeholder={t("tips-message")} required
                                                          style={{width: "80vw"}}></textarea>
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
                                    {t("eth")}: 0x56C4ECf7fBB1B828319d8ba6033f8F3836772FA9
                                </p>
                                <p>
                                    {t("bitcoin")}: bc1qzqkpmpv6kp5a48yc4rcn9gudvjgad6hq9zvk8k
                                </p>
                                <p>
                                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4CL7P88WYLH5J&item_name=To+make+the+service+and+the+world+better%21&currency_code=AUD&source=url"
                                       target="_blank"><img src="https://www.paypalobjects.com/webstatic/logo/logo_paypal_106x27.png"/>&nbsp;{t("buy-me-a-coffee")}</a>
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
