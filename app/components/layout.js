import React from "react"
import BaseLayout from "../common/baseLayout"
import NavBar from "../common/navbar"
import Footer from "../common/footer"


export default class Layout extends React.Component {
	render() {
		let {t} = this.props;

		const leftItems = [
		];

        const rightItems = [
            { as: "a", content: t("features"), key: "features", href: "/#features" },
            { as: "a", content: t("docs"), key: "docs", href: "/#docs" },
        ];

		return (
			<BaseLayout>
				<NavBar
					leftItems={leftItems}
					rightItems={rightItems}
					banner={this.props.banner}
					t={t}
				>
					{this.props.children}
				</NavBar>
				<Footer t={t}/>
			</BaseLayout>
		);
	}
}
