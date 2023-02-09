import { TAKES } from "../../app/shared/TAKES";

export const selectFeaturedTake = () => {
    return TAKES.find((take) => take.featured);
};