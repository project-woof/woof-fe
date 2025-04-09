import { createContext, useContext, useState } from "react";

interface PaginationContextType {
	homePagination: number;
	setHomePagination: React.Dispatch<React.SetStateAction<number>>;
	bookingPagination: number;
	setBookingPagination: React.Dispatch<React.SetStateAction<number>>;
	reviewPagination: number;
	setReviewPagination: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationContext = createContext<PaginationContextType>({
	homePagination: 1,
	setHomePagination: () => {},
	bookingPagination: 1,
	setBookingPagination: () => {},
	reviewPagination: 1,
	setReviewPagination: () => {},
});

interface PaginationProviderProps {
	children: React.ReactNode;
}

export const PaginationProvider = ({ children }: PaginationProviderProps) => {
	const [homePagination, setHomePagination] = useState<number>(1);
	const [bookingPagination, setBookingPagination] = useState<number>(1);
	const [reviewPagination, setReviewPagination] = useState<number>(1);

	const contextValue: PaginationContextType = {
		homePagination,
		setHomePagination,
		bookingPagination,
		setBookingPagination,
		reviewPagination,
		setReviewPagination,
	};

	return (
		<PaginationContext.Provider value={contextValue}>
			{children}
		</PaginationContext.Provider>
	);
};

export const usePagination = () => useContext(PaginationContext);
