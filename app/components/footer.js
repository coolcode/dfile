import React from "react"
import {Container, Row, Col} from "reactstrap"

export default ({t, ...otherProps}) => {

    const scrollToTop = (e) => {
        e.preventDefault()
        window.scrollTo(0, 0)
    }

    return (
        <footer {...otherProps}>
            <Container>
                <hr className="line"/>
                <Row className="mb-3 align-items-center justify-content-xl-between">
                    <Col xs="6" md="3" xl="3">
                        <a href="https://nee.how" target="_blank">
                            <img src="/static/img/banner-neehow.svg" alt="nee.how" width="128px"/><span className="ml-1 d-none d-xl-inline">{t("neehow")}</span>
                        </a>
                    </Col>
                    <Col xs="6" md="3" xl="3" align="right" className="order-md-3  order-xl-3">
                        <a href="#" onClick={scrollToTop}>↑{t("go-to-top")}</a>
                        <a className="ml-2" href="https://github.com/coolcode/dfile" target="_blank">
                            <img src="/static/img/github.svg" alt="nee.how" className="avatar avatar-sm" title="GitHub"/>
                        </a>
                    </Col>
                    <Col xs="12" md="6" xl="6" className="order-md-2 order-xl-2 align-items-center">
                        <div className="copyright text-center text-muted">
                            © 2019-{new Date().getFullYear()}&nbsp;<a href="/" alt="dfile.app">DFile</a>&nbsp;{process.env.VERSION}. All rights reserved.
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
