import React , { Component } from 'react';
import {List, Header, Image, Label} from "semantic-ui-react";
import convert from "./convert"; 
import { ToastContainer, toast } from "react-toastify";
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";

const Toast = ({ message }) => {
    return ( <div>
        <Image src='/static/img/logo.svg' size="mini" floated='left'/>
        <p>{message}</p>
	</div>);
	// return (
	// 	<Header as="h2">
	// 		<Image spaced
	// 			size="mini"
	// 			src="/static/img/logo.svg"
	// 			style={{ marginLeft: "1.5em", marginRight: "1.5em" }}
	// 		/>{message}
	// 		<Header.Content>
	// 			<Header.Subheader></Header.Subheader>
	// 		</Header.Content>
	// 	</Header>
	// );
};

const Tips = ({t}) => {
	return (
		<Header as="h2">
			<Image
				size="mini"
				src="/static/img/cat.svg"
				style={{ marginLeft: "1.5em", marginRight: "1.5em" }}
			/>
			<Header.Content style={{ padding: "0.8em 0 0 0" }}>
				<Header.Subheader>
					<List>
						<List.Item>
							<Image avatar src='/static/img/recharge.svg' />
							<List.Content>
								<List.Header>{t("recharge-title")}</List.Header>
								<List.Description>
								{t('recharge-desc')}
								</List.Description>
							</List.Content>
						</List.Item>
						<List.Item>
							<Image avatar src='/static/img/dice.svg' />
							<List.Content>
								<List.Header>{t("dice-title")}</List.Header>
								<List.Description>
								{t('dice-desc')}
								</List.Description>
							</List.Content>
						</List.Item>
						<List.Item>
							<Image avatar src='/static/img/house.svg' />
							<List.Content>
								<List.Header>{t("buy-title")}</List.Header>
								<List.Description>
								{t('buy-desc')}
								</List.Description>
							</List.Content>
						</List.Item>
					</List>
				</Header.Subheader>
			</Header.Content>
		</Header>
	);
};

const Error = ({ message, timestamp }) => {
	return ( <div>
        <Image src='/static/img/logo.svg' size="mini" floated='left'/>
		<p>{message}</p>
    </div>);
};

const toastMessage = (msg, account) => {
	toast.dismiss();
	if (typeof msg === "string") {
		return toast.success(<Toast message={msg} />);
	}

	if (msg.returnValues) {
		console.log(`msg.returnValues`);
		console.log(msg.returnValues);
	}

	if (msg.event === "OnTips") {
		return toast.success(
			<Tips t={msg.t}/>
		);
	} else if (msg.event == "error") {
		return toast.error(
			<Error
				message={msg.returnValues || msg.message}
				account={account}
			/>
		);
	}

	return toast.success(<Toast message={msg + ""} />);
};


const YoToast = () => {
	return (
		<ToastContainer
			position="top-center"
			autoClose={5000}
			hideProgressBar={true}
			newestOnTop={true}
			closeOnClick
			newestOnTop
			pauseOnVisibilityChange
			draggable
			pauseOnHover
		/>
	);
};

export { YoToast, toastMessage };
