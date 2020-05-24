import React from "react"
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap"

import {i18n} from '../i18n'
import util from "../common/util"

import imgIcon from '../asserts/img/icon.svg'
import langEN from '../asserts/img/lang-en.svg'
import langCN from '../asserts/img/lang-cn.svg'

const langImages = {
    en: langEN,
    cn: langCN
}


const renderLang = ({t}) => {
    const currentLang = (i18n.language || "en")
    const langImageUrl = langImages[currentLang]

    const changeLang = (e, value) => {
        const lang = value || 'en'
        console.info("change lang: ", lang)
        i18n.changeLanguage(lang)
        util.setItem("lang", lang)
    }


    return <>
        {/*Computer Screen*/}
        <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0 d-none d-md-block" nav>
                <img src={langImageUrl} className="img-xs" alt="language"/>
                <span>{t("lang")}</span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem onClick={e => changeLang(e, 'en')}>
                    <img src={langEN} className="img-xs" alt="English"/>
                    <span>English</span>
                </DropdownItem>
                <DropdownItem onClick={e => changeLang(e, 'cn')}>
                    <img src={langCN} className="img-xs" alt="Chinese"/>
                    <span>中文</span>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>


        {/*Mobile Screen*/}
        <NavItem className="d-md-none">
            <hr className="my-1"/>
        </NavItem>

        <NavItem className="d-md-none">
            <NavLink className="nav-link-icon" tag="a" onClick={e => changeLang(e, 'en')}>
                <img src={langEN} className="img-xs" alt="English"/>
                <span className="nav-link-inner--text">English</span>
            </NavLink>
            <NavLink className="nav-link-icon" tag="a" onClick={e => changeLang(e, 'cn')}>
                <img src={langCN} className="img-xs" alt="Chinese"/>
                <span className="nav-link-inner--text">中文</span>
            </NavLink>
        </NavItem>
    </>
}


export default ({t}) => {

    return (
        <>
            <Navbar
                className="navbar-top navbar-horizontal navbar-dark"
                expand="md"
            >
                <Container className="px-3">
                    <NavbarBrand href="/" tag="a">
                        <img alt="dfile.app" src={imgIcon}/>
                        <span className="banner-title">{t("title")}</span>
                    </NavbarBrand>
                    <button className="navbar-toggler" id="navbar-collapse-main">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
                        <div className="navbar-collapse-header d-md-none">
                            <Row>
                                <Col className="collapse-brand" xs="6">
                                    <a href="/">
                                        <img alt="dfile.app" src={imgIcon}/>
                                    </a>
                                </Col>
                                <Col className="collapse-close" xs="6">
                                    <button
                                        className="navbar-toggler"
                                        id="navbar-collapse-main"
                                    >
                                        <span/>
                                        <span/>
                                    </button>
                                </Col>
                            </Row>
                        </div>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink className="nav-link-icon" href="/#features" tag="a">
                                    <span className="nav-link-inner--text">{t('features')}</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link-icon" href="/#docs" tag="a">
                                    <span className="nav-link-inner--text">{t('docs')}</span>
                                </NavLink>
                            </NavItem>
                            {renderLang({t})}
                        </Nav>
                    </UncontrolledCollapse>
                </Container>
            </Navbar>
        </>
    )
}

