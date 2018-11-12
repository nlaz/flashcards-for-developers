import React from 'react';
import { Route } from "react-router-dom";

export default (
	<Route>
		<Route path='/' />
        <Route path='/pages/about' />
        <Route path='/pages/terms-of-service' />
        <Route path='/pages/privacy-policy' />
        <Route path='/collections' />
	</Route>
);