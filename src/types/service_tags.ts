/**
 * ServiceTag enum for pet sitting services
 */
export enum ServiceTag {
    DOG_SITTING = "dog-sitting",
    CAT_SITTING = "cat-sitting",
    LONG_TERM_CARE = "long-term-care",
    DOG_WALKING = "dog-walking",
    PET_BOARDING = "pet-boarding",
    PET_DAYCARE = "pet-daycare",
    HOUSE_SITTING = "house-sitting",
    MEDICATION_ADMIN = "medication-admin"
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
    [ServiceTag.MEDICATION_ADMIN]: "Medication Administration"
  };
  
  /**
   * Array of service tag objects for UI elements
   */
  export const SERVICE_TAG_OPTIONS = Object.entries(SERVICE_TAG_LABELS).map(
    ([id, label]) => ({
      id,
      label
    })
  );