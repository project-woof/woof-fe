import { Star } from "lucide-react";

interface StarRatingProps {
	value: number;
	onChange: React.Dispatch<React.SetStateAction<number>>;
}

export const StarRating = ({ value, onChange }: StarRatingProps) => {
	return (
		<div className="flex items-center space-x-1 mb-4">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					onClick={() => onChange(star)}
					className="focus:outline-none"
				>
					<Star
						className={`h-8 w-8 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
					/>
				</button>
			))}
		</div>
	);
};
