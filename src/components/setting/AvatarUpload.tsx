import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImagePlus, X } from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "sonner";
import type { CreateProfileImage } from "@/types/image";
import { useMutateImage } from "@/composables/mutations/image";
import { useRouter } from "@tanstack/react-router";

interface AvatarUploadProps {
	userId: string;
}

export default function AvatarUpload({ userId }: AvatarUploadProps) {
	const router = useRouter();
	const [image, setImage] = useState<{ preview: string; file: File } | null>(
		null,
	);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [originalFile, setOriginalFile] = useState<File | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [crop, setCrop] = useState<Crop>({
		unit: "%",
		width: 90,
		height: 90,
		x: 5,
		y: 5,
	});
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const { createProfileImageMutation } = useMutateImage();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const uploadedFile = files[0];

		// Validate file type
		if (!uploadedFile.type.startsWith("image/")) {
			toast("Please select an image file");
			return;
		}

		// Validate file size (2MB max)
		if (uploadedFile.size > 2 * 1024 * 1024) {
			toast("File size exceeds 2MB limit");
			return;
		}

		setOriginalFile(uploadedFile);

		// Read the file as data URL
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			setImageSrc(reader.result?.toString() || "");
			setDialogOpen(true);
		});
		reader.readAsDataURL(uploadedFile);
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

					// Set the single image
					setImage({
						file: newFile,
						preview,
					});

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
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeImage = () => {
		if (image?.preview) {
			URL.revokeObjectURL(image.preview);
		}
		setImage(null);
	};

	const uploadImage = async () => {
		if (!image) return;

		const formData = new FormData();
		formData.append("image", image.file);
		try {
			const createImageBody: CreateProfileImage = {
				userId: userId,
				file: image.file,
			};

			try {
				await createProfileImageMutation.mutateAsync(createImageBody);
				setImage(null);
				toast("Image changes has been requested.");
				router.navigate({ to: "/" });
			} catch (error) {
				toast(`Failed to send message: ${error}`);
			}

			// Clear image after successful upload
			if (image.preview) {
				URL.revokeObjectURL(image.preview);
			}
			setImage(null);
		} catch (error) {
			console.error("Error uploading image:", error);
			toast(`Failed to upload image: ${error}`);
		}
	};

	return (
		<div className="p-6 max-w-md mx-auto">

			<div className="mb-6">
				{image ? (
					<div className="relative aspect-square border rounded-lg overflow-hidden bg-white">
						<img
							src={image.preview || "/placeholder.svg"}
							alt="Uploaded image"
							className="absolute inset-0 w-full h-full object-cover"
						/>
						<button
							type="button"
							onClick={removeImage}
							className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black/90 transition-colors"
							aria-label="Remove image"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				) : (
					<button
						type="button"
						onClick={handleUploadClick}
						className="w-full aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
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
				className="hidden"
			/>

			<div className="text-sm text-gray-500 mb-6">
				JPG, PNG or GIF. Max size 2MB.
			</div>

			{/* Upload button */}
			<Button onClick={uploadImage} disabled={!image} className="w-full">
				Upload Image
			</Button>

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
									src={imageSrc || "/placeholder.svg"}
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
									crossOrigin="anonymous"
								/>
							</ReactCrop>
						)}
					</div>

					<AlertDialogFooter>
						<AlertDialogCancel onClick={cancelCropping}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={processCroppedImage}>
							Crop & Save
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
