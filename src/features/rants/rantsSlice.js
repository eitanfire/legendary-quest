import { RANTS } from '../../app/shared/RANTS';

export const selectAllRants = () => {
    return RANTS;
};

export const selectFeaturedRant = () => {
  return RANTS.find((rant) => rant.featured);
};