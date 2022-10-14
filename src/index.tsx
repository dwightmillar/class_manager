import * as React from "react";
import { render } from "react-dom";
import { Router } from "react-router-dom";
import history from "./history";
import ErrorBoundary from "./error-boundary";

const { lazy, Suspense } = React;

const App = lazy(() => import("./App"));

render(
	<ErrorBoundary>
		<Router history={history}>
			<Suspense fallback={<div>Loading...</div>}>
				<App />
			</Suspense>
		</Router>
	</ErrorBoundary>,
	document.getElementById("root")
);
