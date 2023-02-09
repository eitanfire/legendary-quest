import { SECRETS } from "../../app/shared/SECRETS";

export const selectFeaturedSecret = () => {
    return SECRETS.find((secret) => secret.featured);
};