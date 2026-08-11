import { DetailSkeleton } from "@/components/shared/loading-skeleton";

/**
 * Scoped to the detail and edit routes, which await a single row before they
 * can render. Every other page in this group renders its header immediately and
 * streams its own correctly-shaped section skeletons, so a group-level loading
 * boundary would only replace those with a worse, generic one.
 */
export default function ApplicationDetailLoading() {
  return <DetailSkeleton />;
}
