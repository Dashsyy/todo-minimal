import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  title: string;
  bio: string;
};

const queryClient = new QueryClient();

const fetchUser = async (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        title: "Senior Product Designer",
        bio: "Designs delightful user experiences and mentors cross-functional teams to build accessible products.",
      });
    }, 2000);
  });
};

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "h-4 w-full animate-pulse rounded-md bg-slate-700/60",
        className
      )}
      {...props}
    />
  );
};

const UserProfile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
  });

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-xl backdrop-blur"
        >
          <div className="flex items-center space-x-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </motion.div>
      );
    }

    if (!data) {
      return null;
    }

    return (
      <motion.div
        key="profile"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-xl backdrop-blur"
      >
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-sky-400 text-lg font-semibold text-white">
            {data.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-slate-100">{data.name}</p>
            <p className="text-sm text-slate-400">{data.title}</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-950/60 p-4 text-sm text-slate-300">
          <p>{data.bio}</p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
          <div>
            <p className="font-medium text-slate-100">Contact</p>
            <p className="text-slate-400">{data.email}</p>
          </div>
          <button className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-white">
            Send Message
          </button>
        </div>
      </motion.div>
    );
  }, [data, isLoading]);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <AnimatePresence mode="wait">{content}</AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-100">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Async UI Demo</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Skeleton Loading with Smooth Reveal</h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
              This minimal example showcases how to combine TanStack Query, a shadcn-inspired skeleton, and Framer Motion transitions to build a polished async user experience.
            </p>
          </div>
          <UserProfile />
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
