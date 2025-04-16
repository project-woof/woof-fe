import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import { Button } from "../ui/button";
import { useMutateImage } from "@/composables/mutations/image";
import { toast } from "sonner";
import type { CreateImage } from "@/types/image";

interface FileUploadProps {
	userId: string;
}
interface PetsitterImage {
	id: string;
	file: File;
	preview: string;
}

export function FileUpload({ userId }: FileUploadProps) {
	const { createPetsitterImageMutation } = useMutateImage();
	const [images, setImages] = useState<PetsitterImage[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [originalFile, setOriginalFile] = useState<File | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const MAX_IMAGES = 6;
	const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
	const [crop, setCrop] = useState<Crop>({
		unit: "%",
		width: 90,
		height: 90,
		x: 5,
		y: 5,
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const imgRef = useRef<HTMLImageElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const uploadedFile = files[0];

		if (images.length + 1 >= MAX_IMAGES) return;

		// Validate file type
		if (!uploadedFile.type.startsWith("image/")) return;

		// Validate file size
		if (uploadedFile.size > MAX_FILE_SIZE) return;

		setOriginalFile(uploadedFile);

		// Only process image files
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			setImageSrc(reader.result?.toString() || "");
			setDialogOpen(true);
		});
		reader.readAsDataURL(uploadedFile);
	};

	const sendImages = async () => {
		if (images.length < 1) {
			return;
		}
		const files = images.map((image) => image.file);

		const createImageBody: CreateImage = {
			userId: userId,
			files: files,
		};

		try {
			await createPetsitterImageMutation.mutateAsync(createImageBody);
			setImages([]);
			toast("Image changes has been requested.");
		} catch (error) {
			toast(`Failed to send message: ${error}`);
		}
	};

	const removeImage = (id: string) => {
		setImages((prev) => {
			const filtered = prev.filter((image) => image.id !== id);

			// Revoke the object URL to avoid memory leaks
			const imageToRemove = prev.find((image) => image.id === id);
			if (imageToRemove) {
				URL.revokeObjectURL(imageToRemove.preview);
			}

			return filtered;
		});
	};

	const handleUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const processCroppedImage = () => {
		if (!imageSrc || !completedCrop || !imgRef.current || !originalFile) return;

		try {
			const canvas = document.createElement("canvas");
			const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
			const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
			const ctx = canvas.getContext("2d");

			if (!ctx) throw new Error("No 2d context");

			canvas.width = completedCrop.width;
			canvas.height = completedCrop.height;

			ctx.drawImage(
				imgRef.current,
				completedCrop.x * scaleX,
				completedCrop.y * scaleY,
				completedCrop.width * scaleX,
				completedCrop.height * scaleY,
				0,
				0,
				completedCrop.width,
				completedCrop.height,
			);

			canvas.toBlob(
				(blob) => {
					if (!blob) {
						console.error("Canvas is empty");
						return;
					}

					const newFile = new File([blob], originalFile.name, {
						type: "image/jpeg",
						lastModified: new Date().getTime(),
					});

					const preview = URL.createObjectURL(newFile);

					const newPetsitterImage: PetsitterImage = {
						id: crypto.randomUUID(),
						file: newFile,
						preview,
					};

					setImages((prev) => [...prev, newPetsitterImage]);
					setDialogOpen(false);

					// Reset input
					if (fileInputRef.current) {
						fileInputRef.current.value = "";
					}
				},
				"image/jpeg",
				0.95,
			);
		} catch (error) {
			console.error("Error processing image:", error);
			toast("Error processing image");
			setDialogOpen(false);
		}
	};

	const cancelCropping = () => {
		setDialogOpen(false);
		setImageSrc(null);
		setOriginalFile(null);

		// Reset the input
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	return (
		<div className="mt-6">
			<h3 className="text-base font-medium mb-2">Portfolio Images</h3>
			<p className="text-sm text-gray-600 mb-4">
				Upload up to 6 images showcasing your pet sitting services
			</p>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
				{/* Display existing images */}
				{images.map((image) => (
					<div
						key={image.id}
						className="relative aspect-square border rounded-lg overflow-hidden bg-white"
					>
						<div className="">
							<img
								src={image.preview || "/placeholder.svg"}
								alt="Pet sitting portfolio image"
								className="absolute inset-0 w-full h-full object-cover"
							/>
						</div>

						<button
							type="button"
							onClick={() => removeImage(image.id)}
							className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90 transition-colors"
							aria-label="Remove image"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				))}

				{/* Add image placeholder */}
				{images.length < MAX_IMAGES && (
					<button
						type="button"
						onClick={handleUploadClick}
						className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
					>
						<ImagePlus className="h-8 w-8 text-gray-400" />
						<span className="text-sm text-gray-500">Add Image</span>
					</button>
				)}
			</div>

			{/* Hidden file input */}
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/jpeg,image/png,image/gif"
				multiple
				className="hidden"
			/>

			<div className="text-sm text-gray-500">
				JPG, GIF or PNG. Max size 2MB.
			</div>

			<div className="flex justify-end pt-4">
				<Button
					variant="default"
					className=""
					onClick={sendImages}
					disabled={images.length < 1}
				>
					Submit images
				</Button>
			</div>

			{/* Cropping Dialog */}
			<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialogContent className="sm:max-w-[500px]">
					<AlertDialogHeader>
						<AlertDialogTitle>Crop Image</AlertDialogTitle>
						<AlertDialogDescription>
							Position your image within the crop area.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className="mt-4 max-h-[60vh] overflow-auto">
						{imageSrc && (
							<ReactCrop
								crop={crop}
								onChange={(c) => setCrop(c)}
								onComplete={(c) => setCompletedCrop(c)}
								aspect={1}
								className="react-crop-wrapper"
							>
								<img
									ref={imgRef}
									alt="Crop me"
									src={imageSrc}
									style={{
										maxWidth: "100%",
										display: "block",
										maxHeight: "60vh",
									}}
									onLoad={() => {
										setCrop({
											unit: "%",
											width: 90,
											height: 90,
											x: 5,
											y: 5,
										});
									}}
								/>
							</ReactCrop>
						)}
					</div>

					<AlertDialogFooter>
						<Button variant="outline" onClick={cancelCropping}>
							Cancel
						</Button>
						<Button onClick={processCroppedImage}>Crop & Save</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
