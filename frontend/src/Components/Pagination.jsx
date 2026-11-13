import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center mt-8">
            <div className="join">
                <button className="join-item btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                    <ChevronLeftIcon className="size-4" />
                </button>
                <button className="join-item btn btn-disabled">
                    Page {page} of {totalPages}
                </button>
                <button className="join-item btn" disabled={page >= totalPages} onClick={() =>
                    onPageChange(page + 1)}>
                    <ChevronRightIcon className="size-4" />
                </button>
            </div>
        </div>
    );
};
export default Pagination;