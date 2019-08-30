import { Form, Card, Button, Image, Icon, Popup } from "semantic-ui-react";

const iconMap = {
	clock: "far fa-clock",
	money: "fas fa-money-bill-alt",
	piper: "fab fa-pied-piper-alt",
	ad: "fas fa-ad",
	eth: "fab fa-ethereum",
	ethereum: "fab fa-ethereum",
	user: "fa fa-user",
    diamond: "far fa-gem"
};

export default ({ icon, content, tips }) => {
	let iconClass = iconMap[icon] || "fas fa-info-circle";

	return (
		<Popup
			trigger={
				<span>
					<span className="yo-icon">
						<i className={iconClass} />
					</span>
					&nbsp;
					{content}
					&nbsp; &nbsp;
				</span>
			}
			content={tips}
			on="hover"
		/>
	);
};
