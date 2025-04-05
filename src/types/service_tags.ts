/**
 * ServiceTag enum for pet sitting services
 */
export enum ServiceTag {
	DOG_SITTING = "Dog Sitting",
	CAT_SITTING = "Cat Sitting",
	LONG_TERM_CARE = "Long-term Care",
	DOG_WALKING = "Dog Walking",
	PET_BOARDING = "Pet Boarding",
	PET_DAYCARE = "Pet Daycare",
	HOUSE_SITTING = "House Sitting",
	MEDICATION_ADMIN = "Medication Administration",
}

/**
 * Map of service tags to their display labels
 */
export const SERVICE_TAG_LABELS: Record<ServiceTag, string> = {
	[ServiceTag.DOG_SITTING]: "Dog Sitting",
	[ServiceTag.CAT_SITTING]: "Cat Sitting",
	[ServiceTag.LONG_TERM_CARE]: "Long-term Care",
	[ServiceTag.DOG_WALKING]: "Dog Walking",
	[ServiceTag.PET_BOARDING]: "Pet Boarding",
	[ServiceTag.PET_DAYCARE]: "Pet Daycare",
	[ServiceTag.HOUSE_SITTING]: "House Sitting",
	[ServiceTag.MEDICATION_ADMIN]: "Medication Administration",
};

/**
 * Array of service tag objects for UI elements
 */
export const SERVICE_TAG_OPTIONS = Object.entries(SERVICE_TAG_LABELS).map(
	([id, label]) => ({
		id,
		label,
	}),
);
