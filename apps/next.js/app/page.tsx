import Counter from "@/components/counter";

export default function Page() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <p className="mb-2">Next.js v15 + TailwindCSS v4 + Shadcn UI</p>
      <Counter />
    </div>
  );
}
