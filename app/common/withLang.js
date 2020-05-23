import {i18n, withTranslation} from '../i18n'
import util from "./util"

const withLang = (WrappedComponent) => {
    const comp = class extends React.Component {
        constructor(props) {
            super(props)

            i18n.setDefaultNamespace("common")
        }

        componentDidMount() {
            const props = this.props
            if (!i18n.language) {
                i18n.changeLanguage(util.getItem("lang") || props.lang || 'en')
            }
            console.log("lang:", props.lang)
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }

    return withTranslation('common')(comp)
}

export default withLang