import React, {useState, useRef, useEffect} from "react"
import withLang from '../common/withLang'
import Layout from '../components/layout'
import axios from 'axios'
import CountUp from "react-countup"
import {Star, Follow} from '../components/github-buttons'
import {Row, Col, Form, FormGroup, Input, Button, Container} from "reactstrap"

import imgPaypal from '../asserts/img/paypal.png'
import imgPatreon from '../asserts/img/patreon.png'
import imgFree from '../asserts/img/free.svg'
import imgCloud from '../asserts/img/cloud.svg'
import imgDatabase from '../asserts/img/database.svg'
import imgTerminal from '../asserts/img/terminal.svg'
import imgLink from '../asserts/img/link.svg'
import imgClose from '../asserts/img/close.svg'

const isProd = (process.env.NODE_ENV == 'production') // || true
const UP_ENDPOINT = (isProd ? "https://dfile.herokuapp.com" : "http://localhost:9000/up")
const DOWN_ENDPOINT = (isProd ? "https://dfile.app/d" : "http://localhost:9000/d")
const STAT_ENDPOINT = (isProd ? "https://dfile.app/stat" : "http://localhost:9000/stat")


const Index = ({t}) => {
    const [state, setState] = useState({files: []})

    const [total, setTotal] = useState(1012)

    const terminalTitle = '⬆DFile@bruce-macbook-pro: ~'

    const fileInput = useRef(null)

    const reload = async () => {
        try {
            const res = await axios.get(STAT_ENDPOINT)
            setTotal(res.data.file_count)
        } catch (e) {
            console.error(e)
        }
    }


    useEffect(() => {
        reload()
    }, [])

    const onChange = (e) => {
        if (e.target.files.length > 0) {
            console.info("file: ", e.target.files[0])
            uploadAll(e.target.files)
        }
        e.target.value = null
    }

    const uploadAll = (files) => {
        const list = [...state.files]
        //const count = state.files.length
        for (let i = 0; i < files.length; i++) {
            const item = {key: 'key' + i, name: files[i].name, status: 'uploading', url: ''}
            list.push(item)
        }
        setState({files: list})
        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i])
        }

    }

    const uploadFile = (file) => {
        const data = new FormData()
        data.append('file', file)
        data.append('t', new Date().getTime())
        const self = this
        axios.post(UP_ENDPOINT, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.info(file.name, ': ', res)

            setState(state => {
                const list = state.files.map(item => {
                    if (item.name == file.name) {
                        item.url = res.data
                        item.status = 'done'
                    }
                    return item
                })
                return {
                    files: list,
                }
            })

            reload()
        }).catch(error => {
            console.error(error)

            setState(state => {
                const list = state.files.map(item => {
                    if (item.name == file.name) {
                        item.status = 'fail'
                        if (error.response && error.response.data) {
                            item.error = error.response.data
                        } else {
                            item.error = error.toString()
                        }
                    }
                    return item
                })
                return {
                    files: list,
                }
            })
        })
    }

    const onUpload = (e) => {
        e.preventDefault()
        fileInput.current.click()
    }

    const onDrag = (e) => {
        e.preventDefault()
        if (!e.dataTransfer) {
            console.info('e: ', e)
            return
        }
        const files = []
        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile()
                    files.push(file)
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                const file = e.dataTransfer.files[i]
                files.push(file)
            }
        }
        uploadAll(files)
    }

    const onDragOver = (e) => {
        e.preventDefault()
        //console.log('File(s) in drop zone')
    }

    const onClear = (e) => {
        e.preventDefault()
        setState({files: []})
    }

    const renderFileLinks = () => {
        return state.files.map((item, key) => {
            if (item.status == 'done' && item.url.startsWith("http")) {
                return <div key={key}>{item.name}: <a href={item.url} target="_blank">{item.url}</a></div>
            } else if (item.status == 'uploading') {
                return <div key={key}>{item.name}: <span className="message">{t('uploading')}</span></div>
            } else if (item.status == 'fail') {
                return <div key={key}>{item.name}: <span className="red message">{item.error}</span></div>
            } else {
                return <div key={key}>{item.name}: <span className="message">{item.url}</span></div>
            }
        })
    }

    const renderFeatures = () => {
        const features = [
            {img: imgFree, text: t('feature-free')},
            {img: imgCloud, text: t('feature-cloud')},
            {img: imgDatabase, text: t('feature-storage')},
            {img: imgTerminal, text: t('feature-terminal')},
            {img: imgLink, text: t('feature-link')},
        ]

        return features.map((item, i) => (
            <div className="feature" key={i}>
                <img src={item.img}/>
                <h3>{item.text}</h3>
            </div>
        ))
    }
    return (
        <Layout>
            <div className="section">
                <h1>{t("sub-title")}</h1>
                <div className="h2 text-success">
                    <span>🗂️</span>
                    <CountUp className="ml-2" start={0} end={total} duration={3}/>
                    <label className="ml-2">{t("files")}</label>
                </div>
            </div>

            <div className="section">
                <div className="term" onDrop={onDrag} onDragOver={onDragOver}>
                    <div className="term-header">
                        <button className="term-header-button term-header-button-close"></button>
                        <button className="term-header-button term-header-button-minimize"></button>
                        <button className="term-header-button term-header-button-expand"></button>
                        <div className="term-header-title">
                            <span>{terminalTitle}</span>
                        </div>
                    </div>
                    <div className="term-content">
                        <div className="term-content-row">
                            <span className="term-content-comment"># {t('comment-curl')}</span><br/>
                            <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                            <span className="term-content-caret">curl -F file=@yourfile.txt {UP_ENDPOINT}</span>
                            <p className="term-content-output">{DOWN_ENDPOINT}/xxx.txt</p>
                        </div>
                        <div className="term-content-row">
                        <span className="term-content-comment"># {t('comment-using')} <a href='https://github.com/coolcode/dfile/issues/1'
                                                                                         target="_blank">'dfile'</a> {t('comment-alias')},&nbsp;
                            <a href='https://github.com/coolcode/dfile/issues/1' target="_blank">{t("learn-more")}</a>
                        </span><br/>
                            <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                            <span className="term-content-caret">dfile yourfile.txt</span>
                            <p className="term-content-output">{DOWN_ENDPOINT}/xxx.txt</p>
                        </div>
                        <div className="term-content-row">
                            <span className="term-content-comment"># {t('comment-web')}</span><br/>
                            <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                            <p className="term-content-ouput">{t('comment-drag')}<a href='' className="browse" onClick={onUpload}>{t('comment-browse')}</a>
                                {(state.files && state.files.length > 0) && (
                                    <a className="clear" href='' onClick={onClear}>&nbsp;{t('clear-file')} <img src={imgClose} className="clear"/></a>)}
                            </p>
                            <input ref={fileInput} type="file" name="file" multiple style={{display: "none"}} onChange={onChange}/>
                            <div className="term-content-output">
                                {renderFileLinks()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-2">
                    <Button outline color="success" className="text-lg px-6" onClick={onUpload}> {t("upload-file")} </Button>
                </div>
            </div>

            <hr className="line"/>
            <div id="features" className="section features">
                <h2>{t("features")}</h2>
                {renderFeatures()}
            </div>

            <hr className="line"/>
            <div id="docs" className="section">
                <h2>{t("docs")}</h2>
                <Row>
                    <Col xs="12" lg="6">
                        <div className="term-mini">
                            <div className="term-header">
                                <button className="term-header-button term-header-button-close"></button>
                                <button className="term-header-button term-header-button-minimize"></button>
                                <button className="term-header-button term-header-button-expand"></button>
                                <div className="term-header-title">
                                    <span>{terminalTitle}</span>
                                </div>
                            </div>
                            <div className="term-content">
                                <div className="term-content-row">
                                    <span className="term-content-comment"># {t('comment-curl')}</span><br/>
                                    <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                    <span className="term-content-caret">curl -F file=@yourfile.txt {UP_ENDPOINT}</span>
                                    <p className="term-content-output">{DOWN_ENDPOINT}/xxx.txt</p>
                                </div>
                                <div className="term-content-row">
                                    <span className="term-content-comment"># {t('comment-download')}</span><br/>
                                    <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                    <span className="term-content-caret">curl -L {DOWN_ENDPOINT}/xxx.txt -o yourfile.txt</span>
                                    <p className="term-content-output"></p>
                                </div>
                                <div className="term-content-row">
                                </div>
                            </div>
                        </div>

                    </Col>
                    <Col xs="12" lg="6">
                        <div className="term-mini">
                            <div className="term-header">
                                <button className="term-header-button term-header-button-close"></button>
                                <button className="term-header-button term-header-button-minimize"></button>
                                <button className="term-header-button term-header-button-expand"></button>
                                <div className="term-header-title">
                                    <span>{terminalTitle}</span>
                                </div>
                            </div>
                            <div className="term-content">
                                <div className="term-content-row">
                                    <span className="term-content-comment"># {t('comment-using')}
                                        <a href='https://github.com/coolcode/dfile/issues/1' target="_blank">'dfile'</a> {t('comment-alias')},&nbsp;
                                        <a href='https://github.com/coolcode/dfile/issues/1' target="_blank">{t("learn-more")}</a>
                                        </span><br/>
                                    <span className="term-content-comment"># {t('comment-use-alias')}</span><br/>
                                    <span className="term-content-arrow">➜</span> <span className="term-content-tilde">~</span>
                                    <span className="term-content-caret">dfile yourfile.txt</span>
                                    <p className="term-content-output">{DOWN_ENDPOINT}/xxx.txt</p>
                                </div>
                            </div>
                        </div>

                    </Col>
                </Row>
            </div>

            <hr className="line"/>
            <div id="github" className="section">
                <h2>{t("follow-github")}</h2>
                <div>
                    <Follow owner='coolcode' className="mr-2"/>
                    <Star owner='coolcode' repo='dfile'/>
                </div>
            </div>


            <hr className="line"/>
            <div id="contact" className="section">
                <h2>{t("contact")}</h2>
                <div id="contact-form">
                    <Form method="POST" action="https://formspree.io/bruce.meerkat@gmail.com">
                        <FormGroup row>
                            <Col lg={{size: 8, offset: 2}} xs="12">
                                <Input type="email" name="_replyto" aria-describedby="emailHelp" placeholder={t("label-email")} required/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col lg={{size: 8, offset: 2}} xs="12">
                                <textarea type="password" className="form-control" id="message" name="message" placeholder={t("tips-message")} required rows="6"></textarea>
                            </Col>
                        </FormGroup>
                        <div className="text-center">
                            <Button color="primary" className="px-6 text-lg" type="submit" outline>
                                {t("send")}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <hr className="line"/>

            <div id="donate" className="section">
                <h2>{t("donate")}</h2>
                <Row>
                    <Col md="6">
                        <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4CL7P88WYLH5J&item_name=To+make+the+service+and+the+world+better%21&currency_code=AUD&source=url"
                           target="_blank">
                            <img src={imgPaypal} className="img-sm"/><span>{t("buy-me-a-coffee")}</span>
                        </a>
                    </Col>
                    <Col md="6">
                        <a href="https://www.patreon.com/xbruce" target="_blank">
                            <img src={imgPatreon} className="img-sm"/><span>{t("become-a-patron")}</span>
                        </a>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col lg="6">{t("eth")}: <small>0x56C4ECf7fBB1B828319d8ba6033f8F3836772FA9</small></Col>
                    <Col lg="6">{t("bitcoin")}: <small>bc1qzqkpmpv6kp5a48yc4rcn9gudvjgad6hq9zvk8k</small></Col>
                </Row>
            </div>
        </Layout>
    )

}

export default withLang(Index)

 
