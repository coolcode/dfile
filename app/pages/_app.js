import React from 'react'
import {appWithTranslation} from '../i18n'

import '../asserts/scss/yopo.scss'

const App = ({Component, ...pageProps}) => {
    return (
        <Component {...pageProps} />
    )
}

export default appWithTranslation(App)

// export default appWithTranslation(withNamespaces('common')(App))