import React from "react"
import BaseLayout from "./base-layout"
import NavBar from "./navbar"
import Footer from "./footer"
import {withTranslation} from "../i18n"
import {Container} from "reactstrap"


const Layout = ({t, children}) => {
    return (
        <BaseLayout>
            <div className="bg-default" style={{minHeight: "calc(100vh - 6rem)"}}>
                <NavBar t={t}/>
                <Container className="mt-4">
                    {children}
                </Container>
            </div>
            {<Footer t={t}/>}
        </BaseLayout>
    )
}


export default withTranslation('common')(Layout)