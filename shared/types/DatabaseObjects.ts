export interface ClassObject {
	id: number;
	user: String;
	title: string;
}

export interface StudentObject {
	id: number;
	user: String;
	class_id: number;
	name: string;
}

export interface AssignmentObject {
	id: number;
	user: String;
	title: string;
	score: number;
	totalpoints: number;
	student_id: number;
	class_id: number;
}
