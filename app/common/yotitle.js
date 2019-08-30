import React, { Component } from "react";
import {
    Grid
} from "semantic-ui-react";

export default ({content})=>{
    return (<Grid>
					<Grid.Row>
						<Grid.Column textAlign="center">
							<h1 className="title"> <span className="yo-light-title">🂡 </span>&nbsp;{content}&nbsp;<span className="yo-light-title"> 🂮 </span></h1>
						</Grid.Column>
					</Grid.Row>
				</Grid>);
}