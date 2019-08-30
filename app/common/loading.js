import { Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import BaseLayout from "./baseLayout";

export default () => {
	return (
		<BaseLayout>
			<Image src="/static/img/loading.svg" size="large" centered />
		</BaseLayout>
	);
};
