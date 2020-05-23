import {i18n, withTranslation} from '../i18n'
import util from "./util"

const withLang = (WrappedComponent) => {
    const comp = class extends React.Component {
        constructor(props) {
            super(props)

            i18n.setDefaultNamespace("common")
        }

        static async getInitialProps(props) {
            console.log("withLang query:", props.query)
            return {namespacesRequired: ['common'], lang: props.query.lang}
        }

        componentDidMount() {
            let props = this.props
            if (!i18n.language) {
                i18n.changeLanguage(util.getItem("lang") || props.lang || 'en')
            }
            console.log("lang:", props.lang)
            //i18n.changeLanguage(i18n.language === 'en' ? 'cn' : 'en') props.query.lang ||
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }

    return withTranslation('common')(comp)
}

export default withLang