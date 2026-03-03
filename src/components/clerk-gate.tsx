"use client";

import dynamic from "next/dynamic";
import { SignedIn, SignedOut, UserButton as ClerkUserButton } from "@clerk/nextjs";

const isClerkEnabled = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("PLACEHOLDER")
);

/**
 * Renders children only when the user is signed in (or Clerk isn't configured,
 * in which case everything is "signed in" by default).
 */
export function AuthedOnly({ children }: { children: React.ReactNode }) {
  if (!isClerkEnabled) return <>{children}</>;
  return <SignedIn>{children}</SignedIn>;
}

/**
 * Renders children only when the user is signed out
 * (hidden entirely when Clerk isn't configured).
 */
export function UnauthOnly({ children }: { children: React.ReactNode }) {
  if (!isClerkEnabled) return null;
  return <SignedOut>{children}</SignedOut>;
}

/**
 * Safe UserButton that only renders when Clerk is configured.
 */
function UserButtonInner(props: { afterSignOutUrl?: string }) {
  if (!isClerkEnabled) return null;
  return <ClerkUserButton afterSignOutUrl={props.afterSignOutUrl} />;
}

// Avoid SSR prerender so Clerk context is always available on the client
export const SafeUserButton = dynamic(() => Promise.resolve(UserButtonInner), {
  ssr: false,
});
