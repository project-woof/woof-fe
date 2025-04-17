export interface ImageList {
	images: string[];
}

export interface CreateProfileImage {
	userId: string;
	file: File;
}

export interface CreatePetsitterImages {
	userId: string;
	files: File[];
	preserve: string[];
}