import React, { lazy, useState, useEffect, Suspense } from "react";
import { Redirect } from "react-router";
import {
	withRouter,
	BrowserRouter as Router,
	Route,
	Switch,
} from "react-router-dom";
import history from "./history";
import controller from "./controller";
import ClassTabs from "./components/ClassTabs";
const WelcomeView = lazy(() => import("./views/welcome/index"));
const ClassView = lazy(() => import("./views/class/index"));
import "./style.css";

const App = (props: any) => {
	const [state, setState] = useState({
		mounted: false,
		classes: null,
		modal: null,
	});

	useEffect(() => {
		if (!state.mounted) setState({ ...state, mounted: true });
	}, []);

	useEffect(() => {
		if (!state.mounted) return;

		controller.class
			.load()
			.then(setClasses)
			.catch((error) => console.error(error));
	}, [state.mounted]);

	useEffect(() => {
		if (!state.classes) return;
		if (!state.classes.length) {
			history.replace("/welcome");
		} else if (
			state.classes.find(
				({ id }: { id: string }) => id == props.location.pathname.split("/")[1]
			) === undefined
		) {
			history.replace(`/${state.classes[0].id}`);
		}
	}, [state.classes]);

	function setClasses({ data }: { data: any }) {
		console.log({ data });
		if (state.classes === null || data.prototype === Array.prototype)
			return setState({ ...state, classes: data });

		const classIndex = state.classes.findIndex(
			(classData: any) => classData.id == data.id
		);
		const classDoesNotExist = classIndex === -1 ? true : false;
		if (classDoesNotExist) createClass(data);
		else removeClass(data.id, classIndex);

		function createClass(newClass: any) {
			let classes = state.classes;
			classes.push(newClass);
			history.push("/" + newClass.id);
			setState({ ...state, classes });
		}

		function removeClass(id: number, index: number) {
			let route = state.classes[index - 1]
				? state.classes[index - 1].id
				: "welcome";
			let classes = state.classes.filter(
				(classData: any) => classData.id != id
			);
			history.replace("/" + route);
			setState({ ...state, classes });
		}
	}

	function toggleModal(modal: any = null) {
		setState({ ...state, modal });
	}

	return (
		<div id='app'>
			{state.modal}

			<ClassTabs {...props} classes={state.classes} setClasses={setClasses} />

			<Switch>
				<Route exact path='/' render={() => <Redirect to='/ ' />} />
				<Route exact path='/welcome' component={WelcomeView} />
				<Route
					path='/:classId'
					render={(props) => {
						return (
							<Suspense fallback={<div>Loading...</div>}>
								<ClassView
									{...props}
									title={
										state.classes
											? state.classes.find(
													({ id }: { id: any }) =>
														id == props.match.params.classId
											  )?.title
											: null
									}
									setClasses={setClasses}
									toggleModal={toggleModal}
								/>
							</Suspense>
						);
					}}
				/>
			</Switch>
		</div>
	);
};

export default withRouter(App);
