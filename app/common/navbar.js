import React, {Component} from "react";
import {
    Container,
    Image,
    Menu,
    Segment,
    Dropdown
} from "semantic-ui-react";

import {i18n, Link} from '../i18n'
import util from "./util";

const LangMenu = ({t}) => {

    const langOptions = [
        {
            key: 'en',
            text: 'English',
            value: 'en',
            image: {avatar: true, src: '/static/img/lang-en.svg', style: {width: "16px"}},
        },
        {
            key: 'cn',
            text: '中文',
            value: 'cn',
            image: {avatar: true, src: '/static/img/lang-cn.svg', style: {width: "16px"}},
        },
        // {
        //     key: 'ru',
        //     text: 'Русский',
        //     value: 'ru',
        //     image: {avatar: true, src: '/static/img/lang-ru.svg', style: {width: "16px"}},
        // },
        // {
        //     key: 'jp',
        //     text: '日本語',
        //     value: 'jp',
        //     image: {avatar: true, src: '/static/img/lang-jp.svg', style: {width: "16px"}},
        // },
        // {
        //     key: 'kr',
        //     text: '한국어',
        //     value: 'kr',
        //     image: {avatar: true, src: '/static/img/lang-kr.svg', style: {width: "16px"}},
        // }
    ];

    let currentLang = (i18n.language || "en");
    let defaultLang = currentLang;

    let changeLang = (e, {name, value}) => {
        let lang = value || 'en';
        console.log("change lang: ", lang);
        i18n.changeLanguage(lang);
        util.setItem("lang", lang);
    }

    return (<Dropdown
        item trigger={<a title="Choose Language"><img src={`/static/img/lang-${i18n.language || "en"}.svg`} style={{width: "16px"}}/> <span>{t("lang")}</span></a>}
        options={langOptions}
        defaultValue={defaultLang}
        onChange={changeLang}
    />);
}


const NavBarDesktop = ({children, leftItems, rightItems, banner, t}) => (
    <div style={{minHeight: "100vh"}}>
        <Segment
            inverted
            textAlign="center"
            style={{
                minHeight: banner ? "700px" : 0,
                padding: banner ? "0em 0em" : 0
            }}
            vertical
        >
            <Menu inverted secondary size="large">
                <Container>
                    <Menu.Item header as="a" href="/">
                        <Image size="mini" src="/static/img/icon.svg" spaced/>
                        <span className="yo-light-title">{t("title")}</span>
                    </Menu.Item>
                    {leftItems.map(item => (
                        <Menu.Item {...item} />
                    ))}
                    <Menu.Menu position="right">
                        {rightItems.map(item => (
                            <Menu.Item {...item} />
                        ))}
                        <LangMenu t={t}/>
                    </Menu.Menu>
                </Container>
            </Menu>
            {banner ? <Banner/> : ""}
        </Segment>
        <Segment vertical style={{padding: "1em"}}>
            {children}
        </Segment>
    </div>
);

export default class NavBar extends Component {
    state = {
        visible: false
    };

    render() {
        return (
            <div>
                <NavBarDesktop  {...this.props} >
                </NavBarDesktop>
            </div>
        );
    }
}