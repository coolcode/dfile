import React from "react"
import BaseLayout from "../common/baseLayout"
import NavBar from "../common/navbar"
import Footer from "../common/footer"


export default class Layout extends React.Component {
	render() {
		let {t} = this.props;

		const leftItems = [
			// { as: "a", content: "Home", key: "home", href: "/" },
			//{ as: "a", content: t("menu-home"), key: "home", href: "/" },
            // <Label color="blue" size="large" circular>
            // 	Promo
            // </Label>
		];

        const rightItems = [
            { as: "a", content: t("doc"), key: "doc", href: "/#doc" },
            // {
            // 	as: "a",
            // 	content: "",
            // 	key: "",
            // 	href: `${config.codeUrl()}`,
            // 	target: "_blank"
            // }
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
